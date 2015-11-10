/*
 * grunt-plugin-pandoc
 * https://github.com/eaperson/grunt-plugin-pandoc
 *
 * Copyright (c) 2015 Erik Pearson
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var childproc = require('child_process');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('plugin_pandoc', 'Grunt plugin for running pandoc', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });

        // Iterate over all specified file groups.
        this.files.forEach(function (fileGroup) {
            // Concat specified files.
            var src = fileGroup.src
                .map(function (filepath) {
                    if (fileGroup.cwd) {
                        return [fileGroup.cwd, filepath].join('/');
                    } else {
                        return filepath;
                    }
                })
                .filter(function (filepath) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                })
                .forEach(function (filepath) {
                    grunt.log.writeln('Input file: ' + filepath);
                    grunt.log.writeln('Dest dir: ' + fileGroup.dest);
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
            grunt.log.writeln('File group ' + fileGroup.dest + 'done.');
        });
    });

};
