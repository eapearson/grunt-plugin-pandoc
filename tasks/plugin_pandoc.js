/*
 * grunt-plugin-pandoc
 * https://github.com/eaperson/grunt-plugin-pandoc
 *
 * Copyright (c) 2015 Erik Pearson
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var childproc = require('child_process'),
        path = require('path');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('plugin_pandoc', 'Grunt plugin for running pandoc', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
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
            fileGroup.src
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
                .forEach(function (filepath) {
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
                            command.push('-t');
                            command.push(options.template);
                        }
                        command.push(filepath.resolved);
                    grunt.log.writeln('Input file: ' + filepath.resolved);
                    grunt.log.writeln('Dest dir: ' + dest);
                    grunt.log.writeln('Command: ' + command.join(' '));
                });
//                map(function (filepath) {
//                // Read file source.
//                return grunt.file.read(filepath);
//            }).join(grunt.util.normalizelf(options.separator));

            // Handle options.
            //src += options.punctuation;





            // Write the destination file.
            // grunt.file.write(f.dest, src);

            // Print a success message.
            // grunt.log.writeln('File "' + fileGroup.dest + '" created.');
            grunt.log.writeln('File group "' + fileGroup.dest + '" done.');
        });
    });

};
