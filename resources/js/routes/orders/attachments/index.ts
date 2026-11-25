import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:136
 * @route '/orders/{order}/attachments'
 */
export const store = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/orders/{order}/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:136
 * @route '/orders/{order}/attachments'
 */
store.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return store.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:136
 * @route '/orders/{order}/attachments'
 */
store.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:136
 * @route '/orders/{order}/attachments'
 */
    const storeForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:136
 * @route '/orders/{order}/attachments'
 */
        storeForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:207
 * @route '/orders/{order}/attachments/{attachment}'
 */
export const destroy = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/orders/{order}/attachments/{attachment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:207
 * @route '/orders/{order}/attachments/{attachment}'
 */
destroy.url = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                    attachment: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                                attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return destroy.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:207
 * @route '/orders/{order}/attachments/{attachment}'
 */
destroy.delete = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:207
 * @route '/orders/{order}/attachments/{attachment}'
 */
    const destroyForm = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:207
 * @route '/orders/{order}/attachments/{attachment}'
 */
        destroyForm.delete = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::show
 * @see app/Http/Controllers/OrderAttachmentController.php:230
 * @route '/orders/{order}/attachments/{attachment}'
 */
export const show = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/attachments/{attachment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::show
 * @see app/Http/Controllers/OrderAttachmentController.php:230
 * @route '/orders/{order}/attachments/{attachment}'
 */
show.url = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                    attachment: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                                attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::show
 * @see app/Http/Controllers/OrderAttachmentController.php:230
 * @route '/orders/{order}/attachments/{attachment}'
 */
show.get = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderAttachmentController::show
 * @see app/Http/Controllers/OrderAttachmentController.php:230
 * @route '/orders/{order}/attachments/{attachment}'
 */
show.head = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::show
 * @see app/Http/Controllers/OrderAttachmentController.php:230
 * @route '/orders/{order}/attachments/{attachment}'
 */
    const showForm = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::show
 * @see app/Http/Controllers/OrderAttachmentController.php:230
 * @route '/orders/{order}/attachments/{attachment}'
 */
        showForm.get = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderAttachmentController::show
 * @see app/Http/Controllers/OrderAttachmentController.php:230
 * @route '/orders/{order}/attachments/{attachment}'
 */
        showForm.head = (args: { order: string | { order_number: string }, attachment: number | { id: number } } | [order: string | { order_number: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::zip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
export const zip = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zip.url(args, options),
    method: 'get',
})

zip.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/attachments-zip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::zip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
zip.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return zip.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::zip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
zip.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderAttachmentController::zip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
zip.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: zip.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::zip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
    const zipForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: zip.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::zip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
        zipForm.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: zip.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderAttachmentController::zip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
        zipForm.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: zip.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    zip.form = zipForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::request
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
export const request = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(args, options),
    method: 'post',
})

request.definition = {
    methods: ["post"],
    url: '/orders/{order}/attachments/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::request
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
request.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return request.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::request
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
request.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::request
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
    const requestForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: request.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::request
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
        requestForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: request.url(args, options),
            method: 'post',
        })
    
    request.form = requestForm
const attachments = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
show: Object.assign(show, show),
zip: Object.assign(zip, zip),
request: Object.assign(request, request),
}

export default attachments