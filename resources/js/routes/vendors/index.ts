import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vendors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Public\VendorController::show
 * @see app/Http/Controllers/Public/VendorController.php:12
 * @route '/vendors/{vendor}'
 */
export const show = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/vendors/{vendor}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\VendorController::show
 * @see app/Http/Controllers/Public/VendorController.php:12
 * @route '/vendors/{vendor}'
 */
show.url = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { vendor: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vendor: typeof args.vendor === 'object'
                ? args.vendor.slug
                : args.vendor,
                }

    return show.definition.url
            .replace('{vendor}', parsedArgs.vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\VendorController::show
 * @see app/Http/Controllers/Public/VendorController.php:12
 * @route '/vendors/{vendor}'
 */
show.get = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\VendorController::show
 * @see app/Http/Controllers/Public/VendorController.php:12
 * @route '/vendors/{vendor}'
 */
show.head = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\VendorController::show
 * @see app/Http/Controllers/Public/VendorController.php:12
 * @route '/vendors/{vendor}'
 */
    const showForm = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\VendorController::show
 * @see app/Http/Controllers/Public/VendorController.php:12
 * @route '/vendors/{vendor}'
 */
        showForm.get = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\VendorController::show
 * @see app/Http/Controllers/Public/VendorController.php:12
 * @route '/vendors/{vendor}'
 */
        showForm.head = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const vendors = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default vendors