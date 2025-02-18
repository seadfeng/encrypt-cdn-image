# encrypt cdn image

## how to use api?

### bash curl

```bash
curl -d '{"url":"https://www.faviconextractor.com/favicon/openai.com?larger=true"}' \
-H 'x-api-key: dev' \
--proxy "" \
-X POST http://localhost:3000/api/v1/encrypt
```

### output

```json
{
    "status": "ok",
    "encrypt_url": "http://localhost:3000/assets/images/0njJX97OcOcRae1riLjPcJY_aotHWczPqdZUbftxqOXdjr6IZW6ln35ew52PIOO3Rj1xesLfkjl8L436E_GwLXVwPfrUp6Gi1FPLR_2TtBisIrD7gaWIMHDOKg"
}
```

## release

```bash
pnpm release
pnpm publish:release
```