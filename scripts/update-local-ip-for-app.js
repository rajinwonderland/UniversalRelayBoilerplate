import fs from 'fs'

import getLocalIP from './getLocalIP'


let IPAddress = process.argv[ 2 ]

if( IPAddress == undefined )
  IPAddress = getLocalIP( )

if( IPAddress != undefined )
{
  console.log( "IP Address:" + IPAddress )
  updateIPInFile(
    './ios/UniversalRelayBoilerplate/AppDelegate.m',
    'jsCodeLocation = [NSURL URLWithString:@"http:',
    '  jsCodeLocation = [NSURL URLWithString:@"http://' +  IPAddress + ':8081/index.ios.bundle?platform=ios&dev=true"];'
  )
  updateIPInFile(
    './app/NetworkLayer.js',
    'const graphQLServerURL = "http://',
    'const graphQLServerURL = "http://' +  IPAddress + ':4444/graphql";'
  )
  updateIPInFile(
    './.env',
    'HOST=',
    'HOST=' +  IPAddress
  )
}
else
  console.log( "IP Address not specified and could not be found" )

function updateIPInFile( fileName, searchString, newContentOfLine )
{
  let fileLines = fs.readFileSync( fileName, 'utf8' ).split( '\n' )
  let index = 0

  while( index < fileLines.length )
  {
    if( fileLines[ index ].indexOf( searchString ) > -1 )
    {
      if( fileLines[ index ] == newContentOfLine )
        console.log( '[' + fileName + '] is already up to date' )
      else
      {
        fileLines[ index ] = newContentOfLine
        fs.writeFileSync( fileName, fileLines.join( '\n' ) )

        console.log( '[' + fileName + '] has been updated with local IP ' + IPAddress )
      }
      break
    }
    else
      index++
  }
}
