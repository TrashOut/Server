/**
* TRASHOUT IS an environmental project that teaches people how to recycle
* and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
*
* FOR PROGRAMMERS: There are 10 types of programmers -
* those who are helping TrashOut and those who are not. Clean up our code,
* so we can clean up our planet. Get in touch with us: help@trashout.ngo
*
* Copyright 2017 TrashOut, n.f.
*
* This file is part of the TrashOut project.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
*/
'use strict';

module.exports = {
  firebase: null,
  create: function () {
    var firebaseAdmin = require('firebase-admin');
    var serviceAccount = require(__dirname + "/../firebase.service-account-credentials.json");

    var config = {
      databaseURL: 'https://trashoutngo-dev.firebaseio.com',
      credential: firebaseAdmin.credential.cert(serviceAccount)
    };

    return firebaseAdmin.initializeApp(config);
  },
  validateToken: function (token, callback) {
    var firebase = this.firebase = this.firebase || this.create();
    var firebaseAuth = firebase.auth();

    firebaseAuth.verifyIdToken(token).then(function (decodedToken) {

      callback(null, decodedToken);

    }).catch(function (error) {
      error.status = 403;

      if (error.message.indexOf('expired') !== -1) {
        error.status = 440;
      } else if (error.message.indexOf('failed') !== -1) {
        error.status = 401;
      }

      callback(error);
    });
  },
  disableUser: function(uid, callback) {
    var firebaseAdmin = require('firebase-admin');
    var serviceAccount = require(__dirname + "/../firebase.service-account-credentials.json");
    firebaseAdmin.credential.cert(serviceAccount); // needed?

    firebaseAdmin.auth().updateUser(uid, {
      disabled: true
    })
    .then(function(userRecord) {
      callback(userRecord.toJSON());
    })
    .catch(function(error) {
      console.warn("Error updating firebase identity:", error);
    });
  }
};