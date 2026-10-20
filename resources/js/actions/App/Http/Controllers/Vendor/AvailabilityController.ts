import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::index
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:18
 * @route '/vendor/availability'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vendor/availability',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::index
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:18
 * @route '/vendor/availability'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::index
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:18
 * @route '/vendor/availability'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::index
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:18
 * @route '/vendor/availability'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\AvailabilityController::index
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:18
 * @route '/vendor/availability'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\AvailabilityController::index
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:18
 * @route '/vendor/availability'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\AvailabilityController::index
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:18
 * @route '/vendor/availability'
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
* @see \App\Http\Controllers\Vendor\AvailabilityController::store
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:32
 * @route '/vendor/availability'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/vendor/availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::store
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:32
 * @route '/vendor/availability'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::store
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:32
 * @route '/vendor/availability'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Vendor\AvailabilityController::store
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:32
 * @route '/vendor/availability'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Vendor\AvailabilityController::store
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:32
 * @route '/vendor/availability'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::destroy
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:58
 * @route '/vendor/availability/{blockedDate}'
 */
export const destroy = (args: { blockedDate: string | number } | [blockedDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/vendor/availability/{blockedDate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::destroy
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:58
 * @route '/vendor/availability/{blockedDate}'
 */
destroy.url = (args: { blockedDate: string | number } | [blockedDate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { blockedDate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    blockedDate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        blockedDate: args.blockedDate,
                }

    return destroy.definition.url
            .replace('{blockedDate}', parsedArgs.blockedDate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\AvailabilityController::destroy
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:58
 * @route '/vendor/availability/{blockedDate}'
 */
destroy.delete = (args: { blockedDate: string | number } | [blockedDate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Vendor\AvailabilityController::destroy
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:58
 * @route '/vendor/availability/{blockedDate}'
 */
    const destroyForm = (args: { blockedDate: string | number } | [blockedDate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Vendor\AvailabilityController::destroy
 * @see app/Http/Controllers/Vendor/AvailabilityController.php:58
 * @route '/vendor/availability/{blockedDate}'
 */
        destroyForm.delete = (args: { blockedDate: string | number } | [blockedDate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AvailabilityController = { index, store, destroy }

export default AvailabilityController