import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Vendor\ReviewController::index
 * @see app/Http/Controllers/Vendor/ReviewController.php:14
 * @route '/vendor/reviews'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vendor/reviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\ReviewController::index
 * @see app/Http/Controllers/Vendor/ReviewController.php:14
 * @route '/vendor/reviews'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ReviewController::index
 * @see app/Http/Controllers/Vendor/ReviewController.php:14
 * @route '/vendor/reviews'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\ReviewController::index
 * @see app/Http/Controllers/Vendor/ReviewController.php:14
 * @route '/vendor/reviews'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\ReviewController::index
 * @see app/Http/Controllers/Vendor/ReviewController.php:14
 * @route '/vendor/reviews'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\ReviewController::index
 * @see app/Http/Controllers/Vendor/ReviewController.php:14
 * @route '/vendor/reviews'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\ReviewController::index
 * @see app/Http/Controllers/Vendor/ReviewController.php:14
 * @route '/vendor/reviews'
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
const reviews = {
    index: Object.assign(index, index),
}

export default reviews