#!/usr/bin/python
import cgi
import cgitb
from os import listdir
from os.path import isfile, join
import random

cgitb.enable()

print "Content-type: application/json"
print

data = cgi.FieldStorage()
name = data["name"].value
filename = '' + str(name) + '.json'
directory = '/home/kaudso/public_html/prax3/savegames/'

def getJSON(filename, dir):
    with open(dir + filename, 'r') as jsonfile:
        json = jsonfile.read().replace('\n', '')
    return json

files = [f for f in listdir(directory) if isfile(join(directory, f))]
while True:
    if filename in files:
	getJSON(filename, directory)
	print getJSON(filename, directory)
    else:
        print "not found"
    break
