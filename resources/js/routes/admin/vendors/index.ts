import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:21
 * @route '/admin/vendors'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/vendors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:21
 * @route '/admin/vendors'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:21
 * @route '/admin/vendors'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:21
 * @route '/admin/vendors'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:21
 * @route '/admin/vendors'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:21
 * @route '/admin/vendors'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\VendorController::index
 * @see app/Http/Controllers/Admin/VendorController.php:21
 * @route '/admin/vendors'
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
* @see \App\Http\Controllers\Admin\VendorController::update
 * @see app/Http/Controllers/Admin/VendorController.php:47
 * @route '/admin/vendors/{vendor}'
 */
export const update = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/vendors/{vendor}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\VendorController::update
 * @see app/Http/Controllers/Admin/VendorController.php:47
 * @route '/admin/vendors/{vendor}'
 */
update.url = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{vendor}', parsedArgs.vendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VendorController::update
 * @see app/Http/Controllers/Admin/VendorController.php:47
 * @route '/admin/vendors/{vendor}'
 */
update.patch = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\VendorController::update
 * @see app/Http/Controllers/Admin/VendorController.php:47
 * @route '/admin/vendors/{vendor}'
 */
    const updateForm = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\VendorController::update
 * @see app/Http/Controllers/Admin/VendorController.php:47
 * @route '/admin/vendors/{vendor}'
 */
        updateForm.patch = (args: { vendor: string | { slug: string } } | [vendor: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const vendors = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
}

export default vendors