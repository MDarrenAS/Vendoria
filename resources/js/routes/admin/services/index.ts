import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:34
 * @route '/admin/services'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/services',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:34
 * @route '/admin/services'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:34
 * @route '/admin/services'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:34
 * @route '/admin/services'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:34
 * @route '/admin/services'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:34
 * @route '/admin/services'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:34
 * @route '/admin/services'
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
* @see \App\Http\Controllers\Admin\VendorController::status
 * @see app/Http/Controllers/Admin/VendorController.php:55
 * @route '/admin/services/{service}/status'
 */
export const status = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

status.definition = {
    methods: ["patch"],
    url: '/admin/services/{service}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\VendorController::status
 * @see app/Http/Controllers/Admin/VendorController.php:55
 * @route '/admin/services/{service}/status'
 */
status.url = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VendorController::status
 * @see app/Http/Controllers/Admin/VendorController.php:55
 * @route '/admin/services/{service}/status'
 */
status.patch = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\VendorController::status
 * @see app/Http/Controllers/Admin/VendorController.php:55
 * @route '/admin/services/{service}/status'
 */
    const statusForm = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: status.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\VendorController::status
 * @see app/Http/Controllers/Admin/VendorController.php:55
 * @route '/admin/services/{service}/status'
 */
        statusForm.patch = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    status.form = statusForm
const services = {
    index: Object.assign(index, index),
status: Object.assign(status, status),
}

export default services