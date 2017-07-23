import metaGet from 'metaget';
import Url from 'url-parse';
import getLogo from 'website-logo';

Meteor.methods({

	getUrlMetadata(url) {

		if (!isValid(url)) {
			return;
		}

		var fetchMetaDataSync = Meteor.wrapAsync(fetchMetaData);

		var metadata = fetchMetaDataSync(url);
		
		var fetchLogoSync = Meteor.wrapAsync(fetchLogo);
		metadata.logos = fetchLogoSync(url);

		var validateClearbitSync = Meteor.wrapAsync(validateClearbit);
		metadata.logos.clearbit = validateClearbitSync(url);

		return metadata;

	}
});

function validateClearbit(url, callback) {

	var clearbitUrl = 'https://logo.clearbit.com/' + getBaseUrl(url);
	
	HTTP.call('GET', clearbitUrl, {}, (error, result) => {
		
		if (!error) {
			callback(false, clearbitUrl)
		} else {
			callback(false, null);
		}
		
	});
	
}

function fetchLogo(url, callback) {

	getLogo( url, function( error, images ) {
		callback(error, images);
	});
	
}

function fetchMetaData(url, callback) {
	
	metaGet.fetch(url, function (err, meta_response) {
		callback(false, meta_response);
	});
	
}

function getBaseUrl(url) {

	var parsedUrl = new Url(url);
	return parsedUrl.hostname;
	
}

function isValid(url) {
	
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(url);
    
}