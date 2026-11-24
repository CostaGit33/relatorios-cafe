# Relatórios Café

Aplicativo de relatórios de produtos e estoque, preparado para ser recompilado com Flutter.

## Lojas cadastradas

A interface contém estas lojas:

- Atacadao
- BH
- Mix Matheus
- Mercadinho da Esquina
- Mercadinho Limeira
- Supermercado Econômico
- Supermercado Nacional
- Supermercado Niban
- Supermercado Cardoso
- Supermercado Junior 1
- Supermercado Junior 2
- Supermercado Santana
- Compraki Conveniência
- Supermercado cambui
- Supermercado Mini Preço
- Supermercado Guimarães
- Supermercado Noronha
- Marck Sul
- Marck Sul Xpress
- Cestão do povo
- Supermercado Colares

## Flutter

O aplicativo Flutter em [`lib/main.dart`](lib/main.dart) carrega a interface web mantida em [`source/www/`](source/www/). Os dados continuam sendo armazenados localmente pelo `localStorage` do WebView.

O workflow [`build-apk.yml`](.github/workflows/build-apk.yml) instala o Flutter em um runner Ubuntu do GitHub Actions, gera a estrutura Android, executa `flutter build apk --debug` e publica `app-debug.apk` como artefato da execução.

Para gerar manualmente, com Flutter instalado:

```bash
flutter create --platforms=android --org com.cafepromotor --project-name relatorios_cafe .
flutter pub get
flutter build apk --debug
```

O APK fica em `build/app/outputs/flutter-apk/app-debug.apk`.

O APK de desenvolvimento anterior está preservado em [`artifacts/android/app-debug-1.apk`](artifacts/android/app-debug-1.apk).
