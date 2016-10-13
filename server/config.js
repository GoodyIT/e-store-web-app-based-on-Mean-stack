module.exports = {
	// production settings
	SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000/',
	MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/dbTest1',
	SECRET_KEY: process.env.SECRET_KEY || 'spmek-alf56-RodE0-92134-46fsnv-woR4z',
	STRIPE_PUB_KEY: process.env.TEST_PUB_STRIPE_KEY,
	STRIPE_SEC_KEY: process.env.STRIPE_SEC_KEY,
	EASYPOST_KEY: process.env.EASYPOST_KEY,
	
	// test settings
	TEST: {
		SERVER: 'http://localhost:4000/'
	}
};