/*
 * grunt-angular-module-builder
 * https://github.com/RogueVoo/grunt-angular-module-builder
 *
 * Copyright (c) 2015 Andrey Saponenko
 * Licensed under the MIT license.
 */

'use strict'

module.exports = function (grunt) {

	var path = require('path'),
		sep = path.sep,
		fs = require('fs')

	grunt.registerTask('angular_module_builder', 'Grunt task for building AngularJS modules from source', function (target) {

		var config = grunt.config('angular_module_builder')
		if (!config)
			grunt.fail.fatal('Config for angular_module_builder not specified')

		if (grunt.util.kindOf(config) !== 'object')
			grunt.fail.fatal('Config angular_module_builder must be object')

		if (!target) {

			var tasks = []

			for (var t in config)
				if (config.hasOwnProperty(t))
					tasks.push('angular_module_builder:' + t)

			if (tasks.length)
				grunt.task.run(tasks)

		} else {

			var conf = config[target]

			if (!conf)
				grunt.fail.fatal('Config for target angular_module_builder.' + target + ' is not specified')

			if (!conf.src)
				grunt.fail.fatal('Source path angular_module_builder.' + target + '.src in config is not specified')

			conf.src = path.normalize(conf.src)

			if (!grunt.file.exists(conf.src))
				grunt.fail.fatal('Source path specified in angular_module_builder.' + target + '.src config is not found')

			if (!conf.dest)
				grunt.fail.fatal('Dest path angular_module_builder.' + target + '.dest in config is not specified')

			var md = buildModule(conf.name ? conf.name : path.basename(conf.src), conf.src, conf)
			if (md && md.length > 0) {
				grunt.log.writeln('Writing module file: ' + String(conf.dest).yellow)
				grunt.file.write(conf.dest, md)
			}
		}
	})

	function cleanComents(data) {
		var reg = /\s*(\/\*([\s\S]*?)\*\/)/gm
		return data.toString().replace(reg, '')
	}

	function _dotFactor(method, name, content) {
		return "." + method + "('" + name + "'," + content + ")"
	}

	function isArray(v) {
		return grunt.util.kindOf(v) === 'array'
	}

	function isString(v) {
		return grunt.util.kindOf(v) === 'string'
	}

	function startWith(token, str) {
		if (!token || !str)
			return false

		var t = token.toString(),
			s = str.toString()

		return s.indexOf(t) === 0
	}

	function composeFiles(_path, method, conf) {

		if (!grunt.file.isDir(_path))
			return []

		var dir = fs.readdirSync(_path),
			arr = []

		dir.forEach(function (file) {

			var ext = path.extname(file)
			if (ext !== '.js')
				return

			if (startWith(conf.skip, file))
				return

			var name = path.basename(file, ext),
				content = grunt.file.read(path.join(_path, file))

			if (!conf.noTrim)
				content = content.trim()

			if (conf.cleanComents)
				content = cleanComents(content)

			if (name.length && content.length)
				arr.push(_dotFactor(method, name, content))
		})

		return arr
	}

	function buildNestedModules(dir, name, conf) {

		var ni = isArray(conf.include) ? conf.include : [],
			ne = isArray(conf.exclude) ? conf.exclude : [],
			nd = conf.delimeter && conf.delimeter.length ? conf.delimeter : '.',
			result = '',
			_dir = []

		if (!grunt.file.isDir(dir))
			return result

		_dir = fs.readdirSync(dir)
		_dir.forEach(function (file) {

			var mp = path.join(dir, file),
				nm, mn

			if (!grunt.file.isDir(mp))
				return

			if (conf.skip && startWith(conf.skip, file))
				return

			mn = name + nd + file

			if (!ne.length && ni.length && !(ni.indexOf(mn) > 1))
				return

			if (!ni.length && ne.length && (ne.indexOf(mn) > -1))
				return

			result += buildModule(mn, mp, conf)
		})

		return result
	}

	function buildModule(name, dir, conf) {

		var out = '',
			mp = path.join(dir, 'module.js'),
			code = [],
			mod = [
				'constant',
				'value',
				'provider',
				'factory',
				'service',
				'decorator',
				'animation',
				'filter',
				'controller',
				'directive'
			],
			tmp

		if (grunt.file.exists(mp)) {
			tmp = grunt.file.read(mp)
			if (tmp && tmp.length > 0)
				code.push(tmp)
		}

		code.push("\nangular.module('" + name + "')")

		mod.forEach(function (o) {
			code = code.concat(composeFiles(path.join(dir, o), o, conf))
		})

		mp = path.join(dir, 'config.js')
		if (grunt.file.exists(mp)) {
			tmp = grunt.file.read(mp)
			if (tmp && tmp.length > 0)
				code.push(".config(" + tmp + ")")
		}

		mp = path.join(dir, 'run.js')
		if (grunt.file.exists(mp)) {
			tmp = grunt.file.read(mp)
			if (tmp && tmp.length > 0)
				code.push(".run(" + grunt.file.read(mp) + ")")
		}

		grunt.log.writeln('Compile module: ' + String(name).yellow + ' at ' + String(dir).green)

		if (conf.nested === undefined || conf.nested) {
			tmp = buildNestedModules(path.join(dir, 'module'), name, conf)
			if (tmp && tmp.length > 0)
				code.push(tmp)
		}

		return code.join("\n")
	}
}
