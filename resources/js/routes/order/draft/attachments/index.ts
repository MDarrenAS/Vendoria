import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/order/draft/attachments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::store
 * @see app/Http/Controllers/OrderAttachmentController.php:26
 * @route '/order/draft/attachments'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::preview
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
export const preview = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/order/draft/attachments/{tempId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::preview
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
preview.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return preview.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::preview
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
preview.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderAttachmentController::preview
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
preview.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::preview
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
    const previewForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrderAttachmentController::preview
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
        previewForm.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrderAttachmentController::preview
 * @see app/Http/Controllers/OrderAttachmentController.php:107
 * @route '/order/draft/attachments/{tempId}'
 */
        previewForm.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
export const destroy = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/order/draft/attachments/{tempId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
destroy.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
destroy.delete = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrderAttachmentController::destroy
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
    const destroyForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/OrderAttachmentController.php:122
 * @route '/order/draft/attachments/{tempId}'
 */
        destroyForm.delete = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const attachments = {
    store: Object.assign(store, store),
preview: Object.assign(preview, preview),
destroy: Object.assign(destroy, destroy),
}

export default attachments