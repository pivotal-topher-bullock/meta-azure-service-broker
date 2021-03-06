/* jshint camelcase: false */
/* jshint newcap: false */

var msRestAzure = require('ms-rest-azure');
var AzureMgmtRedisCache = require('azure-arm-rediscache');
var AzureEnvironment = require('ms-rest-azure').AzureEnvironment;

var redis;

exports.instantiate = function(azure) {

    var baseUri = 'https://management.azure.com/';
    var options = {
        environment : AzureEnvironment.Azure
    };
    if (azure.environment === 'AzureChinaCloud') {
        baseUri = 'https://management.chinacloudapi.cn/';
        options.environment = AzureEnvironment.AzureChina;
    }

    var appTokenCreds = new msRestAzure.ApplicationTokenCredentials(
        azure.client_id, azure.tenant_id, azure.client_secret, options);

    var rc = new AzureMgmtRedisCache(appTokenCreds, azure.subscription_id, baseUri);
    redis = rc.redis;    
};

exports.provision = function(resourceGroup, cacheName, parameters, next) {
    redis.createOrUpdate(resourceGroup, cacheName, parameters, function(err, result) {
        next(err, result);
    });
};

exports.poll = function(resourceGroup, cacheName, next) {
    redis.get(resourceGroup, cacheName, function(err, result) {
        next(err, result);
    });
};

exports.deprovision = function(resourceGroup, cacheName, next) {
    redis.deleteMethod(resourceGroup, cacheName, function(err, result) {
        next(err, result);
    });
};

// exports.bind = function(next) {
// there is nothing to do for 'bind' with redisCache
// }

// exports.unbind = function(next) {
// there is nothing to do for 'unbind' with redisCache
// }