/*
 * grunt-plugin-pandoc
 * https://github.com/eaperson/grunt-plugin-pandoc
 *
 * Copyright (c) 2015 Erik Pearson
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var Promise = require('bluebird'),
        childproc = Promise.promisify(require('child_process')),
        path = require('path');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('plugin_pandoc', 'Grunt plugin for running pandoc', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var done = this.async(),
            options = this.options({
                punctuation: '.',
                separator: ', ',
                read: 'markdown',
                write: 'html'
            });

        if (!options.extension) {
            options.extension = options.write;
        }

        // Iterate over all specified file groups.
        this.files.forEach(function (fileGroup) {
            // Concat specified files.
            Promise.all(fileGroup.src
                .map(function (filepath) {
                    if (fileGroup.cwd) {
                        return {
                            resolved: [fileGroup.cwd, filepath].join('/'),
                            original: filepath
                        };
                    } else {
                        return {
                            resolved: filepath,
                            original: filepath
                        };
                    }
                })
                .filter(function (filepath) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath.resolved)) {
                        grunt.log.warn('Resolved source file "' + filepath.resolved + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                })
                .map(function (filepath) {
                    var original = path.parse(filepath.original),
                        dest = [fileGroup.dest, original.dir, original.name + '.' + options.extension]
                        .filter(function (item) {
                            return item ? true : false;
                        })
                        .join('/'),
                        command = [
                            'pandoc',
                            '-o', dest,
                            '-r', options.read,
                            '-w', options.write
                        ];
                    if (options.template) {
                        command.push(['--template', options.template].join('='));
                    }
                    command.push(filepath.resolved);
                    return childproc.execAsync(command.join(' '))
                        .then(function (error, stdout, stderr) {
                            grunt.log.writeln('stdout: ' + stdout);
                            grunt.log.writeln('stderr: ' + stderr);
                            if (error !== null) {
                                grunt.log.writeln('error: ' + error);
                            }
                        });
                }))
                .then(function () {
                    grunt.log.ok('Pandoc all done!');
                    done();
                })
                .catch(function (err) {
                    grunt.log.error('ERROR running pandoc');
                    console.log(err);
                });
        });
    });

};
