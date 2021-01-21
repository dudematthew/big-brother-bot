// https://www.npmjs.com/package/fs
import Filesystem from "fs";

export default class Common {

        /**
         * Returns random value from given array
         * @param {Array} array 
         */
        static RandomValue(array) {
                return array[Math.floor(Math.random() * array.length)];
        }

        /**
         * Repeats callback function every
         * amount of ms
         * @param {Number} time 
         * @param {function} callback 
         */
        static LoopAction(time, callback) {
                setTimeout(() => {
                        callback();
                        this.LoopAction(time, callback);
                }, time);
        }

        /**
         * Resize array by removing content
         * from the start
         * @param {Array} arr 
         * @param {Number} size 
         */
        static ResizeArray(arr, size) {
                if (size < 2)
                        return arr;

                while (arr.length > size)
                        arr.shift();

                return arr;
        }       

        /**
         * lists all files in given location
         * @returns {Array.<String>}
         */
        static GetAllFileNamesFromFolder (dir) {

                var results = [];

                Filesystem.readdirSync(dir).forEach(function (fileName) {

                        let file = dir + '/' + fileName;
                        var stat = Filesystem.statSync(file);

                        if (stat && stat.isDirectory()) {
                                results = results.concat(this.GetAllFilesFromFolder(file));
                        } else results.push(fileName);

                });

                return results;

        };
}