import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\OrderDraftController::create
 * @see app/Http/Controllers/Customer/OrderDraftController.php:20
 * @route '/order/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/order/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderDraftController::create
 * @see app/Http/Controllers/Customer/OrderDraftController.php:20
 * @route '/order/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderDraftController::create
 * @see app/Http/Controllers/Customer/OrderDraftController.php:20
 * @route '/order/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderDraftController::create
 * @see app/Http/Controllers/Customer/OrderDraftController.php:20
 * @route '/order/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderDraftController::create
 * @see app/Http/Controllers/Customer/OrderDraftController.php:20
 * @route '/order/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderDraftController::create
 * @see app/Http/Controllers/Customer/OrderDraftController.php:20
 * @route '/order/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderDraftController::create
 * @see app/Http/Controllers/Customer/OrderDraftController.php:20
 * @route '/order/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Customer\OrderDraftController::store
 * @see app/Http/Controllers/Customer/OrderDraftController.php:63
 * @route '/order/draft'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/order/draft',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\OrderDraftController::store
 * @see app/Http/Controllers/Customer/OrderDraftController.php:63
 * @route '/order/draft'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderDraftController::store
 * @see app/Http/Controllers/Customer/OrderDraftController.php:63
 * @route '/order/draft'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\OrderDraftController::store
 * @see app/Http/Controllers/Customer/OrderDraftController.php:63
 * @route '/order/draft'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderDraftController::store
 * @see app/Http/Controllers/Customer/OrderDraftController.php:63
 * @route '/order/draft'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Customer\OrderDraftController::review
 * @see app/Http/Controllers/Customer/OrderDraftController.php:85
 * @route '/order/review'
 */
export const review = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(options),
    method: 'get',
})

review.definition = {
    methods: ["get","head"],
    url: '/order/review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderDraftController::review
 * @see app/Http/Controllers/Customer/OrderDraftController.php:85
 * @route '/order/review'
 */
review.url = (options?: RouteQueryOptions) => {
    return review.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderDraftController::review
 * @see app/Http/Controllers/Customer/OrderDraftController.php:85
 * @route '/order/review'
 */
review.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderDraftController::review
 * @see app/Http/Controllers/Customer/OrderDraftController.php:85
 * @route '/order/review'
 */
review.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: review.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderDraftController::review
 * @see app/Http/Controllers/Customer/OrderDraftController.php:85
 * @route '/order/review'
 */
    const reviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: review.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderDraftController::review
 * @see app/Http/Controllers/Customer/OrderDraftController.php:85
 * @route '/order/review'
 */
        reviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderDraftController::review
 * @see app/Http/Controllers/Customer/OrderDraftController.php:85
 * @route '/order/review'
 */
        reviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    review.form = reviewForm
const OrderDraftController = { create, store, review }

export default OrderDraftController