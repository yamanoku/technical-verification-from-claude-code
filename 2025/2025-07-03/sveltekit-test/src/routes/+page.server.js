/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// Attempt to use Simple Scope on the server
	// This will likely cause hydration mismatches
	try {
		const { scope } = await import('@simple-stack/scope');
		
		return {
			serverScopeId: scope(),
			serverGeneratedAt: new Date().toISOString(),
			serverMultipleIds: Array.from({ length: 3 }, () => scope()),
			serverError: null
		};
	} catch (error) {
		console.error('Server-side Simple Scope error:', error);
		return {
			serverScopeId: 'SERVER_ERROR',
			serverGeneratedAt: 'SERVER_ERROR',
			serverMultipleIds: ['SERVER_ERROR'],
			serverError: error.message
		};
	}
}