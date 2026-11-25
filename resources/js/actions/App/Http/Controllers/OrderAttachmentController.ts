import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderAttachmentController::storeDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
export const storeDraft = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDraft.url(options),
    method: 'post',
})

storeDraft.definition = {
    methods: ["post"],
    url: '/order/draft/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::storeDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
storeDraft.url = (options?: RouteQueryOptions) => {
    return storeDraft.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::storeDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
storeDraft.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDraft.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::storeDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
    const storeDraftForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeDraft.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::storeDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
        storeDraftForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeDraft.url(options),
            method: 'post',
        })
    
    storeDraft.form = storeDraftForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::previewDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
export const previewDraft = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewDraft.url(args, options),
    method: 'get',
})

previewDraft.definition = {
    methods: ["get","head"],
    url: '/order/draft/attachments/{tempId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::previewDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
previewDraft.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tempId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tempId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tempId: args.tempId,
                }

    return previewDraft.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::previewDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
previewDraft.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewDraft.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderAttachmentController::previewDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
previewDraft.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewDraft.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::previewDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
    const previewDraftForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewDraft.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::previewDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
        previewDraftForm.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewDraft.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderAttachmentController::previewDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
        previewDraftForm.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewDraft.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewDraft.form = previewDraftForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::destroyDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
export const destroyDraft = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDraft.url(args, options),
    method: 'delete',
})

destroyDraft.definition = {
    methods: ["delete"],
    url: '/order/draft/attachments/{tempId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::destroyDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
destroyDraft.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tempId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tempId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tempId: args.tempId,
                }

    return destroyDraft.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::destroyDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
destroyDraft.delete = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDraft.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::destroyDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
    const destroyDraftForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyDraft.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::destroyDraft
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
        destroyDraftForm.delete = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyDraft.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyDraft.form = destroyDraftForm
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
* @see \App\Http\Controllers\OrderAttachmentController::downloadZip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
export const downloadZip = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})

downloadZip.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/attachments-zip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::downloadZip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
downloadZip.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return downloadZip.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::downloadZip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
downloadZip.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderAttachmentController::downloadZip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
downloadZip.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadZip.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::downloadZip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
    const downloadZipForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadZip.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::downloadZip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
        downloadZipForm.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadZip.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderAttachmentController::downloadZip
 * @see app/Http/Controllers/OrderAttachmentController.php:243
 * @route '/orders/{order}/attachments-zip'
 */
        downloadZipForm.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadZip.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadZip.form = downloadZipForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::requestAttachment
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
export const requestAttachment = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestAttachment.url(args, options),
    method: 'post',
})

requestAttachment.definition = {
    methods: ["post"],
    url: '/orders/{order}/attachments/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::requestAttachment
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
requestAttachment.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
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

    return requestAttachment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::requestAttachment
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
requestAttachment.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestAttachment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::requestAttachment
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
    const requestAttachmentForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: requestAttachment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::requestAttachment
 * @see app/Http/Controllers/OrderAttachmentController.php:275
 * @route '/orders/{order}/attachments/request'
 */
        requestAttachmentForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: requestAttachment.url(args, options),
            method: 'post',
        })
    
    requestAttachment.form = requestAttachmentForm
const OrderAttachmentController = { storeDraft, previewDraft, destroyDraft, store, destroy, show, downloadZip, requestAttachment }

export default OrderAttachmentController