#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * Run this locally to verify your .env file is set up correctly
 * Usage: node verify-env.js
 */

const fs = require('fs')
const path = require('path')

// Load .env.local file manually
const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=')
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim()
        
        // Handle quoted values with inline comments
        if (value.startsWith('"')) {
          const endQuoteIndex = value.indexOf('"', 1)
          if (endQuoteIndex > 0) {
            value = value.substring(1, endQuoteIndex)
          }
        } else if (value.startsWith("'")) {
          const endQuoteIndex = value.indexOf("'", 1)
          if (endQuoteIndex > 0) {
            value = value.substring(1, endQuoteIndex)
          }
        } else {
          // No quotes, remove inline comments
          const commentIndex = value.indexOf('#')
          if (commentIndex >= 0) {
            value = value.substring(0, commentIndex).trim()
          }
        }
        
        process.env[key.trim()] = value.trim()
      }
    }
  })
  console.log('✅ Loaded .env.local file\n')
} else {
  console.log('⚠️  No .env.local file found. Checking system environment variables only.\n')
}

const requiredBackendVars = [
  'CASHFREE_APP_ID',
  'CASHFREE_SECRET_KEY',
  'CASHFREE_ENVIRONMENT',
  'CASHFREE_DEFAULT_CUSTOMER_PHONE',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GOOGLE_API_KEY',
]

const requiredFrontendVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_CASHFREE_ENVIRONMENT',
  'NEXT_PUBLIC_APP_URL',
]

console.log('🔍 Verifying Environment Variables...\n')

let hasErrors = false
let hasWarnings = false

// Check backend variables
console.log('📦 Backend Variables:')
requiredBackendVars.forEach((varName) => {
  const value = process.env[varName]
  if (!value) {
    console.log(`  ❌ ${varName}: NOT SET`)
    hasErrors = true
  } else {
    console.log(`  ✅ ${varName}: SET (length: ${value.length})`)
  }
})

console.log('\n🌐 Frontend Variables:')
requiredFrontendVars.forEach((varName) => {
  const value = process.env[varName]
  if (!value) {
    console.log(`  ❌ ${varName}: NOT SET`)
    hasErrors = true
  } else {
    console.log(`  ✅ ${varName}: SET`)
    if (varName === 'NEXT_PUBLIC_APP_URL' && value) {
      console.log(`     → ${value}`)
    }
  }
})

// Check environment consistency
console.log('\n⚙️  Environment Consistency Checks:')

const backendEnv = process.env.CASHFREE_ENVIRONMENT
const frontendEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT

if (backendEnv && frontendEnv) {
  if (backendEnv.toLowerCase() === frontendEnv.toLowerCase()) {
    console.log(`  ✅ Cashfree environments match: ${backendEnv}`)
  } else {
    console.log(`  ❌ Environment mismatch!`)
    console.log(`     Backend: ${backendEnv}`)
    console.log(`     Frontend: ${frontendEnv}`)
    console.log(`     These MUST be the same!`)
    hasErrors = true
  }
} else {
  console.log(`  ⚠️  Cannot verify environment match (one or both not set)`)
  hasWarnings = true
}

// Validate environment values
if (backendEnv) {
  const validEnvs = ['sandbox', 'production']
  if (!validEnvs.includes(backendEnv.toLowerCase())) {
    console.log(`  ⚠️  CASHFREE_ENVIRONMENT should be 'sandbox' or 'production', got: ${backendEnv}`)
    hasWarnings = true
  }
}

// Check phone number format
const phone = process.env.CASHFREE_DEFAULT_CUSTOMER_PHONE
if (phone) {
  if (!/^\d{10}$/.test(phone)) {
    console.log(`  ⚠️  CASHFREE_DEFAULT_CUSTOMER_PHONE should be 10 digits, got: ${phone}`)
    hasWarnings = true
  }
}

// Check APP_URL format
const appUrl = process.env.NEXT_PUBLIC_APP_URL
if (appUrl) {
  if (appUrl.endsWith('/')) {
    console.log(`  ⚠️  NEXT_PUBLIC_APP_URL should not end with '/', got: ${appUrl}`)
    hasWarnings = true
  }
  if (!appUrl.startsWith('http')) {
    console.log(`  ⚠️  NEXT_PUBLIC_APP_URL should start with http:// or https://, got: ${appUrl}`)
    hasWarnings = true
  }
}

// Summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ ERRORS FOUND: Please fix the missing or incorrect variables')
  process.exit(1)
} else if (hasWarnings) {
  console.log('⚠️  WARNINGS: Configuration may work but check warnings above')
  process.exit(0)
} else {
  console.log('✅ All environment variables are properly configured!')
  console.log('\n📝 Next steps:')
  console.log('   1. Make sure these same variables are set on your deployment platform')
  console.log('   2. Deploy your application')
  console.log('   3. Test the payment flow')
  console.log('   4. Check /api/cashfree/diagnose endpoint on deployed site')
  process.exit(0)
}

