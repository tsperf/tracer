pnpm ui:build --sourcemap &&
pnpm build --sourcemap &&
code ./playground --extensionDevelopmentPath=.  --inspect-extensions 3300
