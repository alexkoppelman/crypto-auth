# React - MySQL(MARIADB) - Node-Red Http endpoints - Metamask Integration

I was plaing with std metamask integration in react and wanted to see if I could manage an off-chain user db using the Metamask address as the Key User Identifier.
Advantage of course there's no need for a password.

## Basic user management: 
- Users can add their details once authenticated with metamask
- Users can update their details once authenticated with metamask
- Admin can ban/unban users
- Admin can delete users 

There is no security at all at the moment, so please, please do not use this, like seriously!

## MYSQL 
The mySQL database in the background is a fairly simple users table, set up like this:
```
CREATE TABLE `Users` (
  `idUsers` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(99) DEFAULT NULL,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `ethAddress` varchar(99) NOT NULL,
  `userIcon` varchar(50) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `Status` varchar(100) DEFAULT NULL,
  `Role` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idUsers`),
  UNIQUE KEY `Users_UN` (`ethAddress`),
  KEY `Users_ethAddress_IDX` (`ethAddress`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1026 DEFAULT CHARSET=utf8mb4;
```

## Node-Red HTTP Endpoints
The endpoints in Node-red are a bit messy (using params and body depending on what worked first here):
```
[{"id":"601ac2f76e9efd60","type":"http in","z":"a2aa8fbd.4cf9c8","name":"MYSQL Get User Data from Address","url":"/userfromAddress/:address","method":"get","upload":false,"swaggerDoc":"","x":180,"y":980,"wires":[["cc3618947e39475d"]]},{"id":"ddeef9cea32127da","type":"mysql","z":"a2aa8fbd.4cf9c8","mydb":"82311452.492ed8","name":"GET","x":550,"y":980,"wires":[["55da9b4b95cfbf41"]]},{"id":"55da9b4b95cfbf41","type":"change","z":"a2aa8fbd.4cf9c8","name":"Set Headers","rules":[{"t":"set","p":"headers","pt":"msg","to":"{}","tot":"json"},{"t":"set","p":"headers.content-type","pt":"msg","to":"application/json","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":690,"y":980,"wires":[["431d39413340ecc4"]]},{"id":"431d39413340ecc4","type":"http response","z":"a2aa8fbd.4cf9c8","name":"","statusCode":"","headers":{},"x":850,"y":980,"wires":[]},{"id":"cc3618947e39475d","type":"template","z":"a2aa8fbd.4cf9c8","name":"","field":"topic","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"SELECT * from Users.Users where Users.ethAddress = '{{req.params.address}}' ;","output":"str","x":420,"y":980,"wires":[["ddeef9cea32127da"]]},{"id":"38ec53445ccdd20c","type":"http response","z":"a2aa8fbd.4cf9c8","name":"","statusCode":"","headers":{},"x":850,"y":1020,"wires":[]},{"id":"e8da6b804f3f2e4f","type":"change","z":"a2aa8fbd.4cf9c8","name":"Set Headers","rules":[{"t":"set","p":"headers","pt":"msg","to":"{}","tot":"json"},{"t":"set","p":"headers.content-type","pt":"msg","to":"application/json","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":690,"y":1020,"wires":[["38ec53445ccdd20c"]]},{"id":"2a4dc37a63bb0919","type":"mysql","z":"a2aa8fbd.4cf9c8","mydb":"82311452.492ed8","name":"PUT","x":550,"y":1020,"wires":[["e8da6b804f3f2e4f"]]},{"id":"440a583646f57934","type":"template","z":"a2aa8fbd.4cf9c8","name":"","field":"topic","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"SET\n@userName = '{{payload.userName}}',\n@firstName = '{{payload.firstName}}',\n@lastName = '{{payload.lastName}}',\n@email = '{{payload.email}}',\n@ethAddress = '{{payload.ethAddress}}';\n\nINSERT INTO Users.Users\n    (userName, firstName, lastName, ethAddress, email) \nVALUES\n    (@userName, @firstName, @lastName, @ethAddress, @email)\nON DUPLICATE KEY UPDATE\n    userName = @userName,\n    firstName = @firstName,\n    lastName = @lastName,\n    ethAddress = @ethAddress,\n    email = @email\n\n\n","output":"str","x":420,"y":1020,"wires":[["2a4dc37a63bb0919"]]},{"id":"196e7c24023ad88d","type":"http in","z":"a2aa8fbd.4cf9c8","name":"MYSQL PUT User Data from Address","url":"/userPUTAddress","method":"put","upload":false,"swaggerDoc":"","x":190,"y":1020,"wires":[["440a583646f57934"]]},{"id":"e75219472eb3cfbb","type":"http response","z":"a2aa8fbd.4cf9c8","name":"","statusCode":"","headers":{},"x":850,"y":1060,"wires":[]},{"id":"c24f58b85afdcbd5","type":"change","z":"a2aa8fbd.4cf9c8","name":"Set Headers","rules":[{"t":"set","p":"headers","pt":"msg","to":"{}","tot":"json"},{"t":"set","p":"headers.content-type","pt":"msg","to":"application/json","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":690,"y":1060,"wires":[["e75219472eb3cfbb"]]},{"id":"ebb6d0d5d620f119","type":"mysql","z":"a2aa8fbd.4cf9c8","mydb":"82311452.492ed8","name":"GET","x":550,"y":1060,"wires":[["c24f58b85afdcbd5"]]},{"id":"f6071c710d9e8711","type":"template","z":"a2aa8fbd.4cf9c8","name":"","field":"topic","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"SELECT * FROM Users.Users LIMIT 100\n\n","output":"str","x":420,"y":1060,"wires":[["ebb6d0d5d620f119"]]},{"id":"66a783bc99f985af","type":"http in","z":"a2aa8fbd.4cf9c8","name":"MYSQL GET All User Data","url":"/userGETall","method":"get","upload":false,"swaggerDoc":"","x":150,"y":1060,"wires":[["f6071c710d9e8711"]]},{"id":"ab46d4646c083bbf","type":"http response","z":"a2aa8fbd.4cf9c8","name":"","statusCode":"","headers":{},"x":850,"y":1100,"wires":[]},{"id":"d8e41067f9459623","type":"change","z":"a2aa8fbd.4cf9c8","name":"Set Headers","rules":[{"t":"set","p":"headers","pt":"msg","to":"{}","tot":"json"},{"t":"set","p":"headers.content-type","pt":"msg","to":"application/json","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":690,"y":1100,"wires":[["ab46d4646c083bbf"]]},{"id":"ac4b298b09258d0c","type":"mysql","z":"a2aa8fbd.4cf9c8","mydb":"82311452.492ed8","name":"GET","x":550,"y":1100,"wires":[["d8e41067f9459623"]]},{"id":"1d71bc92149f66eb","type":"template","z":"a2aa8fbd.4cf9c8","name":"","field":"topic","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"UPDATE Users.Users\nSet\nStatus = '{{req.body.banstat}}'\nWhere idUsers = {{req.body.id}};\n","output":"str","x":420,"y":1100,"wires":[["ac4b298b09258d0c"]]},{"id":"854b6aba6d0c861f","type":"http in","z":"a2aa8fbd.4cf9c8","name":"MYSQL  Ban user","url":"/userBanPUT","method":"put","upload":false,"swaggerDoc":"","x":120,"y":1100,"wires":[["1d71bc92149f66eb"]]},{"id":"93b88a1aa958dd0b","type":"http response","z":"a2aa8fbd.4cf9c8","name":"","statusCode":"","headers":{},"x":850,"y":1140,"wires":[]},{"id":"5ddb47d267de2ac5","type":"change","z":"a2aa8fbd.4cf9c8","name":"Set Headers","rules":[{"t":"set","p":"headers","pt":"msg","to":"{}","tot":"json"},{"t":"set","p":"headers.content-type","pt":"msg","to":"application/json","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":690,"y":1140,"wires":[["93b88a1aa958dd0b"]]},{"id":"07629e06f93429a7","type":"mysql","z":"a2aa8fbd.4cf9c8","mydb":"82311452.492ed8","name":"GET","x":550,"y":1140,"wires":[["5ddb47d267de2ac5"]]},{"id":"10ac4484001c0933","type":"template","z":"a2aa8fbd.4cf9c8","name":"","field":"topic","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"DELETE FROM Users.Users\nWhere idUsers = {{req.params.id}};\n","output":"str","x":420,"y":1140,"wires":[["07629e06f93429a7"]]},{"id":"43196fa01c6db20f","type":"http in","z":"a2aa8fbd.4cf9c8","name":"MYSQL Delete user","url":"/userDelete/:id","method":"delete","upload":false,"swaggerDoc":"","x":130,"y":1140,"wires":[["10ac4484001c0933"]]},{"id":"82311452.492ed8","type":"MySQLdatabase","name":"INSERT","host":"127.0.0.1","port":"3306","db":"cryptov1","tz":"","charset":"UTF8"}]
```

This will get you these endpoints:

GETUserUrl = 'https://192.168.1.100:1880/userfromAddress/'
PUTUserUrl = 'https://192.168.1.100:1880/userPUTAddress/'
DELETEUserUrl = 'https://192.168.1.100:1880/userDelete/'
GETAllUserUrl = 'https://192.168.1.100:1880/userGETall/'
BanUserURL = 'https://192.168.1.100:1880/userBanPUT/'

## The code
the Code is all in the App.js file, it's a bit of a mess, but it's the first working version.
React is using Axios to talk to the endpoints and ethers.js to chat with metamask.


