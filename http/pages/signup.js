const crypto = require('crypto');
// Create a hash object
const hash = crypto.createHash('sha256');
const fs = require('java.util.fs')
const rand = require('java.util.random')

let String("usr") = document.getElementByID('usernm')

let String("pw") = document.getElementByID('paswd')

let accept = document.getElementByType('submit')

switch( usr.length ){
	case undefined:
		document.getElementByID('err').innerHTML = "UserName Required"
		break
	case >= 8:
		...
		break
	default:
		document.getElementByID('err').innerHTML = "username too short"
		break
}

// Get the digest in hexadecimal format
// Update the hash with data
hash.update('usr, pw');
const digest = hash.digest('hex');

let outfile = rand('.'rand())

fs.out('digest, outfile')