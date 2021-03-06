'use strict';

/**
 * Search for folder and files.
 */
class Filecrawler{

    /**
     * @param path String
     */
    constructor(path){
        this.init();
        this.path = path;
    }

    /**
     * Initialization of needed modules.
     */
    init(){
        this.fs_module = require("fs");
        this.path_module = require('path');
    }

    /**
     * Crawl for files.
     * @returns {Array}
     */
    getFiles(){

        /**
         * Split path in array.
         * @type {*|string[]}
         */
        var path_array = this.path.split(this.path_module.sep);

        /**
         * Get the file from array for later use.
         * @type {string | * | void}
         */
        var file = path_array.splice(path_array.length - 1, 1)[0].replace(/\./g, "\\.");

        var temp_string = '';
        var temp_array = [];
        var return_array = [];

        for(var i in path_array){

            /**
             * If the array value contains an asterisk.
             * The folder while be scanned for new folders and found folders will be added to the temp array.
             *
             * If the the array value does't contain an asterisk.
             * Append array value to the temp_string.
             */
            if(!path_array[i].includes('*')){
                temp_string = temp_string + path_array[i] + this.path_module.sep;

                /**
                 * If the string never contains a asterisk add it to the temp_array for later use.
                 */
                if (i == path_array.length -1)
                    temp_array.push(temp_string);

            }else{
                this.fs_module.readdirSync(temp_string).forEach(folder => {

                    var re = new RegExp('^' + path_array[i].replace(/\*/g, '.*') + '$');

                    if(folder.match(re)){
                        var check_path = temp_string + folder;
                        var stats = this.fs_module.statSync(check_path);
                        if(stats.isDirectory()){
                            temp_array.push(check_path);
                        }
                    }

                });
            }
        }

        /**
         * Loop through the temp_array and search for files.
         */
        for(var a in temp_array){
            this.fs_module.readdirSync(temp_array[a]).forEach(files => {
                var stats = this.fs_module.statSync(temp_array[a] + this.path_module.sep + files);

                var re = new RegExp('^' + file.replace(/\*/g, '.*') + '$');
                if(stats.isFile() &&  files.match(re)){
                    return_array.push(temp_array[a] + this.path_module.sep + files);
                }
            });
        }

        return return_array;
    }
}

module.exports = Filecrawler;