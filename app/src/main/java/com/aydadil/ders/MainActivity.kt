package com.aydadil.ders

import android.Manifest
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.ConnectivityManager
import android.net.Network
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.DownloadListener
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import java.io.File
import java.net.URLDecoder
import java.util.Locale

class MainActivity : android.app.Activity() {
    private val home = "https://ders.aydadil.com/"
    private lateinit var web: WebView
    private lateinit var offlinePanel: LinearLayout
    private var fileCallback: android.webkit.ValueCallback<Array<Uri>>? = null
    private var cameraUri: Uri? = null
    private var cameraFile: File? = null
    private var pendingDownload: String? = null
    private var offline = false
    private val chooseFile = 4101
    private val askDownloadPermission = 4102
    private val networkCallback = object : ConnectivityManager.NetworkCallback() {
        override fun onAvailable(network: Network) {
            runOnUiThread { if (offline) loadHome() }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.rgb(16, 35, 63)
        window.navigationBarColor = Color.rgb(16, 35, 63)
        buildScreen()
        configureWebView()
        if (savedInstanceState != null) web.restoreState(savedInstanceState) else loadHome()
        try { (getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager).registerDefaultNetworkCallback(networkCallback) } catch (_: Exception) {}
    }

    private fun buildScreen() {
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setBackgroundColor(Color.rgb(16, 35, 63)) }
        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val bars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            view.setPadding(bars.left, bars.top, bars.right, maxOf(bars.bottom, ime.bottom))
            insets
        }
        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(16), 0, dp(12), 0)
            setBackgroundColor(Color.rgb(16, 35, 63))
        }
        val title = TextView(this).apply {
            text = "AYDA  •  Öğrenci Portalı"
            textSize = 16f
            setTextColor(Color.WHITE)
            setTypeface(null, android.graphics.Typeface.BOLD)
        }
        val refresh = Button(this).apply {
            text = "Yenile"
            textSize = 13f
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.TRANSPARENT)
            setOnClickListener { loadHome() }
        }
        bar.addView(title, LinearLayout.LayoutParams(0, dp(54), 1f))
        bar.addView(refresh, LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(54)))
        root.addView(bar)

        val frame = FrameLayout(this)
        web = WebView(this)
        frame.addView(web, FrameLayout.LayoutParams(-1, -1))
        offlinePanel = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(28), dp(24), dp(28), dp(24))
            setBackgroundColor(Color.WHITE)
            visibility = View.GONE
        }
        val message = TextView(this).apply {
            text = "İnternet bağlantısı yok gibi görünüyor.\nBağlantınızı kontrol edip yeniden deneyin."
            textSize = 17f
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(16, 35, 63))
        }
        val retry = Button(this).apply {
            text = "Yeniden dene"
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.rgb(16, 35, 63))
            setOnClickListener { loadHome() }
        }
        offlinePanel.addView(message)
        offlinePanel.addView(retry, LinearLayout.LayoutParams(-2, dp(48)).apply { topMargin = dp(18) })
        frame.addView(offlinePanel, FrameLayout.LayoutParams(-1, -1))
        root.addView(frame, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
        ViewCompat.requestApplyInsets(root)
    }

    @Suppress("SetJavaScriptEnabled")
    private fun configureWebView() {
        CookieManager.getInstance().setAcceptCookie(true)
        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportMultipleWindows(false)
            javaScriptCanOpenWindowsAutomatically = true
            allowFileAccess = false
            allowContentAccess = true
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            userAgentString = userAgentString.replace("; wv", "")
        }
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, false)
        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean = route(request.url)
            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) showOffline()
            }
            override fun onReceivedHttpError(view: WebView, request: WebResourceRequest, errorResponse: android.webkit.WebResourceResponse) {
                if (request.isForMainFrame && errorResponse.statusCode >= 500) showOffline()
            }
        }
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(view: WebView, callback: android.webkit.ValueCallback<Array<Uri>>, params: FileChooserParams): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                openFilePicker(params)
                return true
            }
        }
        web.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimeType, _ -> download(url, userAgent, contentDisposition, mimeType) })
    }

    private fun route(uri: Uri): Boolean {
        val scheme = uri.scheme?.lowercase(Locale.ROOT) ?: return false
        if (scheme == "http" || scheme == "https") {
            val host = uri.host?.lowercase(Locale.ROOT).orEmpty()
            if (host == "aydadil.com" || host.endsWith(".aydadil.com")) return false
            if (host == "wa.me" || host.endsWith("whatsapp.com") || host == "api.whatsapp.com") {
                openExternal(uri, Intent(Intent.ACTION_VIEW, uri).apply { setPackage("com.whatsapp") })
                return true
            }
            openExternal(uri, Intent(Intent.ACTION_VIEW, uri))
            return true
        }
        if (scheme == "intent") {
            try {
                val intent = Intent.parseUri(uri.toString(), Intent.URI_INTENT_SCHEME)
                startActivity(intent)
            } catch (_: Exception) { Toast.makeText(this, "Bu bağlantı açılamadı.", Toast.LENGTH_SHORT).show() }
            return true
        }
        if (scheme == "tel" || scheme == "mailto" || scheme == "whatsapp" || scheme == "sms" || scheme == "geo" || scheme == "market") {
            openExternal(uri, Intent(Intent.ACTION_VIEW, uri))
            return true
        }
        return scheme != "about"
    }

    private fun openExternal(uri: Uri, intent: Intent) {
        try { startActivity(intent) }
        catch (_: ActivityNotFoundException) {
            try { startActivity(Intent(Intent.ACTION_VIEW, uri)) }
            catch (_: Exception) { Toast.makeText(this, "Bağlantıyı açacak uygulama bulunamadı.", Toast.LENGTH_SHORT).show() }
        }
    }

    private fun openFilePicker(params: WebChromeClient.FileChooserParams) {
        val type = params.acceptTypes.filter { it.isNotBlank() }.joinToString(",").ifBlank { "*/*" }
        val picker = Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            this.type = type
            putExtra(Intent.EXTRA_ALLOW_MULTIPLE, params.mode == WebChromeClient.FileChooserParams.MODE_OPEN_MULTIPLE)
        }
        val chooser = Intent.createChooser(picker, "Dosya seçin")
        val capture = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        try {
            val photo = File(cacheDir, "ayda-camera-${System.currentTimeMillis()}.jpg")
            cameraFile = photo
            cameraUri = FileProvider.getUriForFile(this, "$packageName.fileprovider", photo)
            capture.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri)
            capture.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(capture))
        } catch (_: Exception) { cameraUri = null; cameraFile = null }
        try { startActivityForResult(chooser, chooseFile) }
        catch (_: Exception) { fileCallback?.onReceiveValue(null); fileCallback = null }
    }

    private fun download(url: String, userAgent: String, disposition: String?, mime: String?) {
        if (Build.VERSION.SDK_INT <= 28 && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            pendingDownload = url
            requestPermissions(arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), askDownloadPermission)
            return
        }
        enqueueDownload(url, userAgent, disposition, mime)
    }

    private fun enqueueDownload(url: String, userAgent: String, disposition: String?, mime: String?) {
        try {
            val request = DownloadManager.Request(Uri.parse(url)).apply {
                setMimeType(mime ?: "application/octet-stream")
                addRequestHeader("User-Agent", userAgent)
                CookieManager.getInstance().getCookie(url)?.let { addRequestHeader("Cookie", it) }
                addRequestHeader("Referer", web.url ?: home)
                setTitle(fileName(url, disposition))
                setDescription("AYDA Öğrenci Portalı")
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName(url, disposition))
            }
            (getSystemService(DOWNLOAD_SERVICE) as DownloadManager).enqueue(request)
            Toast.makeText(this, "İndirme başladı. Dosyalar > İndirilenler bölümünden açabilirsiniz.", Toast.LENGTH_LONG).show()
        } catch (_: Exception) { Toast.makeText(this, "Dosya indirilemedi. Lütfen tekrar deneyin.", Toast.LENGTH_LONG).show() }
    }

    private fun fileName(url: String, disposition: String?): String {
        val fromHeader = disposition?.let { Regex("filename\\*?=(?:UTF-8''|\\\"?)([^;\\\"]+)", RegexOption.IGNORE_CASE).find(it)?.groupValues?.getOrNull(1) }
        val raw = fromHeader ?: Uri.parse(url).lastPathSegment ?: "ayda-dosya"
        return URLDecoder.decode(raw.trim().trim('"'), "UTF-8").replace(Regex("[^A-Za-z0-9._-]"), "_").ifBlank { "ayda-dosya" }
    }

    private fun loadHome() {
        offline = false
        offlinePanel.visibility = View.GONE
        web.visibility = View.VISIBLE
        web.loadUrl(home)
    }

    private fun showOffline() {
        offline = true
        web.visibility = View.GONE
        offlinePanel.visibility = View.VISIBLE
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode != chooseFile) return
        val result = when {
            resultCode != RESULT_OK -> null
            data?.clipData != null -> Array(data.clipData!!.itemCount) { data.clipData!!.getItemAt(it).uri }
            data?.data != null -> arrayOf(data.data!!)
            cameraUri != null && cameraFile?.exists() == true -> arrayOf(cameraUri!!)
            else -> null
        }
        fileCallback?.onReceiveValue(result)
        fileCallback = null
        cameraUri = null
        cameraFile = null
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == askDownloadPermission) {
            val url = pendingDownload
            pendingDownload = null
            if (grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED && url != null) enqueueDownload(url, web.settings.userAgentString, null, null)
            else Toast.makeText(this, "İndirme izni verilmedi.", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) { web.saveState(outState); super.onSaveInstanceState(outState) }
    override fun onBackPressed() { if (web.canGoBack() && !offline) web.goBack() else super.onBackPressed() }
    override fun onDestroy() {
        try { (getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager).unregisterNetworkCallback(networkCallback) } catch (_: Exception) {}
        fileCallback?.onReceiveValue(null)
        web.destroy()
        super.onDestroy()
    }
    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}
