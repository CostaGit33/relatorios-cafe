import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RelatoriosCafeApp());
}

class RelatoriosCafeApp extends StatelessWidget {
  const RelatoriosCafeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Relatórios de Produtos',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff6f4e37)),
        useMaterial3: true,
      ),
      home: const RelatoriosWebView(),
    );
  }
}

class RelatoriosWebView extends StatefulWidget {
  const RelatoriosWebView({super.key});

  @override
  State<RelatoriosWebView> createState() => _RelatoriosWebViewState();
}

class _RelatoriosWebViewState extends State<RelatoriosWebView> {
  late final WebViewController _controller;
  bool _carregando = true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) => setState(() => _carregando = false),
        ),
      )
      ..loadFlutterAsset('source/www/index.html');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_carregando)
              const Center(child: CircularProgressIndicator()),
          ],
        ),
      ),
    );
  }
}
