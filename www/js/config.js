'use strict';

angular.module('starter.config', [])

.constant("$ionicLoadingConfig", {
    "template": "请求中..."
})

.constant("ENV", {
    "version": "2.0.1",
    "name": "production",
    "debug": true,
    "domain": "http://10.10.76.156:8080",
    "api": "/api"
})

;