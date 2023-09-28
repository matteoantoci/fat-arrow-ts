export default {
	preset: 'ts-jest',
	coverageDirectory: 'coverage',
	setupFilesAfterEnv: ['./src/setupTests.ts'],
	testEnvironment: 'node',
	testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
	testPathIgnorePatterns: ['/node_modules/', '/.github/', '/.idea/', '/docs/', '/dist/'],
}
