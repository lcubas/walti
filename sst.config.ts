/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "walti",
			home: "aws",
			providers: {
				aws: { region: "us-east-1" },
			},
			// Production keeps its data and cannot be removed by accident; other stages clean up after themselves.
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: input?.stage === "production",
		};
	},
	async run() {
		const { router } = await import("./infra/router");
		await import("./infra/api");
		await import("./infra/web");

		return {
			url: router.url,
		};
	},
});
