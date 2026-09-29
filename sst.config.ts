/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "walti",
			home: "aws",
			// Production keeps its data and cannot be removed by accident; other stages clean up after themselves.
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: input?.stage === "production",
		};
	},
	async run() {
		const { api } = await import("./infra/api");
		const { web } = await import("./infra/web");

		return {
			api: api.url,
			web: web.url,
		};
	},
});
