if (AWS && AWS.config) {
	//This ASW key give read access to both tables but write access to the inscription
	AWS.config.credentials = {
		accessKeyId: '',
		secretAccessKey: ''
	};
	AWS.config.region = '';
}
