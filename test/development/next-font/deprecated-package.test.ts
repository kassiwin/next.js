/* eslint-env jest */
import { createNextDescribe } from 'e2e-utils'
import { check } from 'next-test-utils'

createNextDescribe(
  'Deprecated @next/font warning',
  {
    files: {
      'pages/index.js': '',
    },
    dependencies: {
      react: 'latest',
      'react-dom': 'latest',
      '@next/font': 'canary',
    },
    skipStart: true,
  },
  ({ next }) => {
    it('should warn if @next/font is in deps', async () => {
      await next.start()
      await check(() => next.cliOutput, /ready/)
      await check(
        () => next.cliOutput,
        new RegExp('please use the built-in `next/font` instead')
      )

      await next.stop()
      await next.clean()
    })

    it('should not warn if @next/font is not in deps', async () => {
      // Remove @next/font from deps
      const packageJson = JSON.parse(await next.readFile('package.json'))
      delete packageJson.dependencies['@next/font']
      await next.patchFile('package.json', JSON.stringify(packageJson))

      await next.start()
      await check(() => next.cliOutput, /ready/)
      expect(next.cliOutput).not.toInclude(
        'please use the built-in `next/font` instead'
      )

      await next.stop()
      await next.clean()
    })
  }
)
