<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\VendorController as AdminVendorController;
use App\Http\Controllers\Customer\NotificationController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\OrderDraftController;
use App\Http\Controllers\Customer\ReviewController as CustomerReviewController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\VendorController;
use App\Http\Controllers\Public\VendorSearchController;
use App\Http\Controllers\Vendor\AvailabilityController;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\Vendor\OnboardingController;
use App\Http\Controllers\Vendor\OrderController as VendorOrderController;
use App\Http\Controllers\Vendor\ProfileController as VendorProfileController;
use App\Http\Controllers\Vendor\ReviewController as VendorReviewController;
use App\Http\Controllers\Vendor\ServiceController as VendorServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/vendors', VendorSearchController::class)->name('vendors.index');
Route::get('/vendors/{vendor:slug}', [VendorController::class, 'show'])->name('vendors.show');
Route::get('/services/{service:slug}', [ServiceController::class, 'show'])->name('services.show');
Route::get('/order/create', [OrderDraftController::class, 'create'])->name('order.create');
Route::post('/order/draft', [OrderDraftController::class, 'store'])->middleware('throttle:orders')->name('order.draft');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/order/review', [OrderDraftController::class, 'review'])->name('order.review');
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:orders')->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])
        ->middleware('role:customer')
        ->name('orders.index');
    Route::get('/orders/{order:order_number}', [OrderController::class, 'show'])
        ->middleware('role:customer')
        ->name('orders.show');
    Route::delete('/orders/{order:order_number}', [OrderController::class, 'cancel'])
        ->middleware('role:customer')
        ->name('orders.cancel');
    Route::post('/orders/{order:order_number}/review', [CustomerReviewController::class, 'store'])
        ->middleware('role:customer')
        ->name('orders.review.store');
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'read'])
        ->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll'])
        ->name('notifications.read-all');
    Route::redirect('/profile', '/settings/profile')
        ->middleware('auth')
        ->name('profile.show');

    Route::inertia('dashboard', 'dashboard')
        ->middleware('role:customer')
        ->name('dashboard');

});

Route::middleware(['auth', 'verified', 'role:vendor'])
    ->prefix('vendor')
    ->name('vendor.')
    ->group(function (): void {
        Route::get('onboarding', [OnboardingController::class, 'show'])->name('onboarding');
        Route::put('onboarding', [OnboardingController::class, 'update'])->name('onboarding.update');

        Route::middleware('vendor.profile.complete')->group(function (): void {
            Route::get('dashboard', DashboardController::class)->name('dashboard');
            Route::get('profile', [VendorProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('profile', [VendorProfileController::class, 'update'])->name('profile.update');
            Route::get('orders', [VendorOrderController::class, 'index'])->name('orders.index');
            Route::get('orders/{order:order_number}', [VendorOrderController::class, 'show'])->name('orders.show');
            Route::patch('orders/{order:order_number}/status', [VendorOrderController::class, 'changeStatus'])->name('orders.status');
            Route::get('reviews', [VendorReviewController::class, 'index'])->name('reviews.index');
            Route::resource('services', VendorServiceController::class)->except(['show']);
            Route::get('availability', [AvailabilityController::class, 'index'])->name('availability.index');
            Route::post('availability', [AvailabilityController::class, 'store'])->name('availability.store');
            Route::delete('availability/{blockedDate}', [AvailabilityController::class, 'destroy'])->name('availability.destroy');
        });
    });

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', AdminDashboardController::class)->name('dashboard');
        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
        Route::patch('/vendors/{vendor:slug}', [AdminVendorController::class, 'update'])->name('vendors.update');
        Route::get('/services', [AdminVendorController::class, 'services'])->name('services.index');
        Route::patch('/services/{service:slug}/status', [AdminVendorController::class, 'updateServiceStatus'])->name('services.status');
        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::patch('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
        Route::patch('/reviews/{review}', [AdminReviewController::class, 'update'])->name('reviews.update');
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('users.status');
    });

require __DIR__.'/settings.php';
