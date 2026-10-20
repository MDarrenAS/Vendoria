import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
const VendorSearchController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VendorSearchController.url(options),
    method: 'get',
})

VendorSearchController.definition = {
    methods: ["get","head"],
    url: '/vendors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
VendorSearchController.url = (options?: RouteQueryOptions) => {
    return VendorSearchController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
VendorSearchController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VendorSearchController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
VendorSearchController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: VendorSearchController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
    const VendorSearchControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: VendorSearchController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
        VendorSearchControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: VendorSearchController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\VendorSearchController::__invoke
 * @see app/Http/Controllers/Public/VendorSearchController.php:15
 * @route '/vendors'
 */
        VendorSearchControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: VendorSearchController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    VendorSearchController.form = VendorSearchControllerForm
export default VendorSearchController