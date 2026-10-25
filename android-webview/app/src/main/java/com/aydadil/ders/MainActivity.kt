package com.aydadil.ders

import android.app.Activity
import android.app.AlertDialog
import android.app.DownloadManager
import android.content.Intent
import android.net.Uri
import android.net.http.SslError
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.webkit.CookieManager
import android.webkit.SafeBrowsingResponse
import android.webkit.SslErrorHandler
import android.webkit.URLUtil
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.TextView
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var root: FrameLayout
    private lateinit var web: WebView
    private var popup: WebView? = null
    private var fileCallback: android.webkit.ValueCallback<Array<Uri>>? = null
    private var fullscreen: android.view.View? = null
    private var originalSystemUi = 0
    private val chooserRequest = 42

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.decorView.setOnApplyWindowInsetsListener { view, insets ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val bars = insets.getInsets(android.view.WindowInsets.Type.systemBars())
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            }
            insets
        }
        root = FrameLayout(this)
        setContentView(root)
        web = makeWebView()
        root.addView(web, FrameLayout.LayoutParams(-1, -1))
        if (savedInstanceState == null) web.loadUrl(BuildConfig.START_URL)
        else web.restoreState(savedInstanceState)
    }

    private fun makeWebView(): WebView = WebView(this).apply {
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = false
        settings.allowContentAccess = true
        settings.javaScriptCanOpenWindowsAutomatically = false
        settings.setSupportMultipleWindows(true)
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(this, false)
        webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean =
                route(view, request.url.toString())

            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) showOffline()
            }

            override fun onReceivedSslError(view: WebView, handler: SslErrorHandler, error: SslError) {
                handler.cancel()
            }

            override fun onSafeBrowsingHit(view: WebView, request: WebResourceRequest, threatType: Int, callback: SafeBrowsingResponse) {
                callback.backToSafety(true)
            }
        }
        webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(view: WebView, callback: android.webkit.ValueCallback<Array<Uri>>, params: FileChooserParams): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    startActivityForResult(params.createIntent(), chooserRequest)
                    true
                } catch (_: Exception) {
                    fileCallback = null
                    false
                }
            }

            override fun onCreateWindow(view: WebView, isDialog: Boolean, isUserGesture: Boolean, resultMsg: android.os.Message): Boolean {
                if (!isUserGesture || popup != null) return false
                val child = makeWebView()
                popup = child
                root.addView(child, FrameLayout.LayoutParams(-1, -1))
                (resultMsg.obj as WebView.WebViewTransport).webView = child
                resultMsg.sendToTarget()
                return true
            }

            override fun onCloseWindow(window: WebView) { closePopup() }

            override fun onShowCustomView(view: android.view.View, callback: CustomViewCallback) {
                if (fullscreen != null) { callback.onCustomViewHidden(); return }
                fullscreen = view
                originalSystemUi = window.decorView.systemUiVisibility
                root.addView(view, FrameLayout.LayoutParams(-1, -1))
                window.decorView.systemUiVisibility = 5894 or 1024 or 512
            }

            override fun onHideCustomView() {
                fullscreen?.let { root.removeView(it) }
                fullscreen = null
                window.decorView.systemUiVisibility = originalSystemUi
            }
        }
        setDownloadListener { url, _, disposition, mime, _ ->
            if (url.startsWith("https://", true)) runCatching {
                val name = URLUtil.guessFileName(url, disposition, mime)
                    .replace(Regex("[\\\\/\\p{Cntrl}]"), "_")
                    .take(120)
                    .ifBlank { "ayda-download" }
                val request = DownloadManager.Request(Uri.parse(url))
                    .setMimeType(mime)
                    .setTitle(name)
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    .setDestinationInExternalFilesDir(this@MainActivity, Environment.DIRECTORY_DOWNLOADS, name)
                (getSystemService(DOWNLOAD_SERVICE) as DownloadManager).enqueue(request)
                Toast.makeText(this@MainActivity, "İndirme başladı", Toast.LENGTH_SHORT).show()
            }.onFailure { Toast.makeText(this@MainActivity, "İndirme başlatılamadı", Toast.LENGTH_SHORT).show() }
        }
    }

    private fun route(view: WebView, raw: String): Boolean {
        if (NavigationPolicy.isAllowed(raw, BuildConfig.PREVIEW_MODE)) return false
        if (NavigationPolicy.isExternalScheme(raw)) {
            runCatching { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(raw))) }
                .onFailure { Toast.makeText(this, "Bu bağlantı açılamadı", Toast.LENGTH_SHORT).show() }
            return true
        }
        if (raw.startsWith("https://", true)) {
            runCatching { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(raw))) }
                .onFailure { Toast.makeText(this, "Bağlantı açılamadı", Toast.LENGTH_SHORT).show() }
            return true
        }
        Toast.makeText(this, "Güvenli olmayan bağlantı engellendi", Toast.LENGTH_SHORT).show()
        return true
    }

    private fun showOffline() {
        if (!::root.isInitialized) return
        val page = TextView(this).apply {
            text = "Bağlantı kurulamadı\n\nTekrar dene"
            textSize = 20f
            gravity = android.view.Gravity.CENTER
        }
        root.removeView(web)
        root.addView(page, FrameLayout.LayoutParams(-1, -1))
        page.setOnClickListener {
            root.removeView(page)
            root.addView(web, FrameLayout.LayoutParams(-1, -1))
            web.reload()
        }
    }

    private fun closePopup() {
        popup?.let { root.removeView(it); it.destroy() }
        popup = null
    }

    @Deprecated("Deprecated in Android API")
    override fun onBackPressed() {
        val top = popup ?: web
        if (top.canGoBack()) top.goBack()
        else if (popup != null) closePopup()
        else AlertDialog.Builder(this).setMessage("Uygulamadan çıkılsın mı?")
            .setNegativeButton("Kal", null).setPositiveButton("Çık") { _, _ -> finish() }.show()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == chooserRequest) {
            fileCallback?.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data))
            fileCallback = null
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        web.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        fileCallback?.onReceiveValue(null)
        closePopup()
        if (::web.isInitialized) { root.removeView(web); web.destroy() }
        super.onDestroy()
    }
}
