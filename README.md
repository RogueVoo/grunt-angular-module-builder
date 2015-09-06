# grunt-angular-module-builder

> Grunt task for building AngularJS modules from source

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-angular-module-builder --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-module-builder');
```

## The "angular_module_builder" task

### Overview
In your project's Gruntfile, add a section named `angular_module_builder` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  angular_module_builder: {
    myModule: {
		name:'my-module',
		src:'~/dev/modules/my-module',
		dest:'~/dev/module/build/my-module.js',
		skip:'_',
		exclude:['my-module.child-module']
    },
  },
});
```

### Options

#### name
Type: `String`

Module name in output.

#### src
Type: `String`
Default value: `'.'`

Directory where placed module sources.

#### dest
Type: `String`
Default value: `'.'`

Destination file name.

#### skip
Type: `String`
Default value: `'_'`

Skip files if they start with this option value.

## License

The MIT License

Copyright (c) 2010-2015 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
