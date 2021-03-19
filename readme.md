# Start dev
## You can change environment settings
``` node
 cd (to repo directory)
 npm i
```

# Start dev on HTTP-Client
``` node
 cp .\src\clients\http-client\.development.env .\src\clients\http-client\.env
 npm run dev:http-client
```

# Start dev on LIB
``` node
 cp .\src\lib\.development.env .\src\lib\.env
 npm run dev:lib
```

# Publish bundle

``` node
 npm run publish:bundle
```

## Config icon of bundle

Create icon.ico inside resources.

[Create icon with sizes here](https://icoconvert.com/)


### Sizes
1. 16x16
1. 32x32
1. 48x48
1. 64x64
1. 128x128