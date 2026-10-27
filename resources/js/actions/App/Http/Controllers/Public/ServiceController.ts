import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\ServiceController::show
 * @see app/Http/Controllers/Public/ServiceController.php:12
 * @route '/services/{service}'
 */
export const show = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/services/{service}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\ServiceController::show
 * @see app/Http/Controllers/Public/ServiceController.php:12
 * @route '/services/{service}'
 */
show.url = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { service: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service: typeof args.service === 'object'
                ? args.service.slug
                : args.service,
                }

    return show.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ServiceController::show
 * @see app/Http/Controllers/Public/ServiceController.php:12
 * @route '/services/{service}'
 */
show.get = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\ServiceController::show
 * @see app/Http/Controllers/Public/ServiceController.php:12
 * @route '/services/{service}'
 */
show.head = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\ServiceController::show
 * @see app/Http/Controllers/Public/ServiceController.php:12
 * @route '/services/{service}'
 */
    const showForm = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\ServiceController::show
 * @see app/Http/Controllers/Public/ServiceController.php:12
 * @route '/services/{service}'
 */
        showForm.get = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\ServiceController::show
 * @see app/Http/Controllers/Public/ServiceController.php:12
 * @route '/services/{service}'
 */
        showForm.head = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ServiceController = { show }

export default ServiceController