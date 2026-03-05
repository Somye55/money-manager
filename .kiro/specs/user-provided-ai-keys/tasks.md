# Implementation Plan: User-Provided AI Keys (BYOK)

## Overview

This implementation plan converts the BYOK feature design into actionable coding tasks. The feature enables users to provide their own AI API keys (ChatGPT, Groq, or Gemini) for expense parsing, with secure storage, validation, multi-provider fallback, and screenshot monitoring control.

The implementation follows a bottom-up approach: core infrastructure first (storage, validation), then key management logic, then UI integration, and finally feature integration with existing expense parsing.

## Tasks

- [x] 1. Set up core infrastructure and provider configurations
  - Create provider configuration constants with API endpoints, key formats, and metadata
  - Define TypeScript interfaces for KeyStatus, ValidationResult, ParseRequest, and ParseResponse
  - Set up error types and constants for validation and storage operations
  - _Requirements: 1.1, 2.1, 5.1, 10.3_

- [x] 2. Implement secure key storage layer
  - [x] 2.1 Create base KeyStorage interface and abstract class
    - Define interface methods: setKey, getKey, removeKey, hasKey, getProviders, clearAll
    - Create abstract base class with common validation logic
    - _Requirements: 1.3, 1.4, 7.1, 7.2, 10.2_

  - [x] 2.2 Implement Web key storage using IndexedDB and Web Crypto API
    - Create IndexedDB database schema for api_keys and settings stores
    - Implement AES-256-GCM encryption using SubtleCrypto
    - Implement PBKDF2 key derivation with user-specific salt
    - Implement encrypt/decrypt methods with IV handling
    - Implement all KeyStorage interface methods for web platform
    - _Requirements: 1.3, 1.4, 7.1, 7.2, 10.2_

  - [ ]\* 2.3 Write unit tests for Web key storage
    - Test encryption/decryption round-trip
    - Test key storage and retrieval
    - Test error handling for invalid data
    - _Requirements: 7.1, 7.2_

  - [x] 2.4 Create Android Capacitor plugin for secure storage
    - Create SecureStoragePlugin.java with set, get, remove methods
    - Implement Android Keystore integration with AES/GCM/NoPadding
    - Implement key generation with KeyGenParameterSpec
    - Implement encryption with IV prepending to ciphertext
    - Implement decryption with IV extraction
    - Store encrypted data in SharedPreferences
    - _Requirements: 1.3, 1.4, 7.1, 7.2, 10.2_

  - [x] 2.5 Implement Android key storage wrapper in JavaScript
    - Create AndroidKeyStorage class that calls Capacitor plugin
    - Implement all KeyStorage interface methods using plugin calls
    - Handle platform detection and plugin availability
    - _Requirements: 1.3, 1.4, 7.2, 10.2_

  - [ ]\* 2.6 Write integration tests for Android key storage
    - Test storage and retrieval on Android emulator
    - Test encryption verification
    - Test error handling
    - _Requirements: 7.1, 7.2_

  - [x] 2.7 Create platform-agnostic storage factory
    - Detect platform (web vs Android) and return appropriate storage implementation
    - Export singleton instance for app-wide use
    - _Requirements: 10.1, 10.2_

- [x] 3. Implement key validation layer
  - [x] 3.1 Create KeyValidator class with provider-specific test methods
    - Implement validate() method that routes to provider-specific validators
    - Implement testChatGPT() with OpenAI models endpoint test
    - Implement testGroq() with Groq models endpoint test
    - Implement testGemini() with Gemini models endpoint test
    - Implement 10-second timeout for all validation requests
    - Implement error type detection (invalid_key, network_error, rate_limit, timeout)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]\* 3.2 Write unit tests for key validation
    - Test successful validation for each provider
    - Test invalid key detection
    - Test network error handling
    - Test timeout handling
    - Test rate limit detection
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4. Checkpoint - Ensure storage and validation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Key Manager core logic
  - [x] 5.1 Create KeyManager class with key lifecycle methods
    - Implement setKey() with format validation, key validation, and storage
    - Implement removeKey() with confirmation and storage deletion
    - Implement testKey() for stored keys
    - Implement getKeyStatuses() to retrieve all provider statuses
    - Implement hasValidKey() to check if any valid key exists
    - Implement key status caching with lastTested timestamps
    - Ensure API keys never appear in logs or error messages
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 3.3, 7.5, 7.6_

  - [x] 5.2 Implement provider priority and fallback logic
    - Implement setPriority() to save provider order
    - Implement getPriority() to retrieve provider order with defaults
    - Implement getActiveKey() to return first valid key by priority
    - Implement getNextKey() to return next fallback key after failure
    - Store priority order in platform-specific settings storage
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 5.3 Implement screenshot monitoring control logic
    - Add method to check if screenshot monitoring can be enabled (requires valid key)
    - Add method to get screenshot monitoring state
    - Add method to set screenshot monitoring state with validation
    - Automatically disable screenshot monitoring when all keys removed
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.8_

  - [ ]\* 5.4 Write unit tests for KeyManager
    - Test key addition and removal flows
    - Test priority management
    - Test fallback logic
    - Test screenshot monitoring control
    - Test key status caching
    - _Requirements: 1.1, 1.2, 5.1, 5.2, 11.6_

- [x] 6. Implement expense parser integration
  - [x] 6.1 Update ExpenseParser to use KeyManager
    - Modify parse() method to call KeyManager.getActiveKey()
    - Implement parseWithProvider() for provider-specific parsing
    - Implement fallback logic using KeyManager.getNextKey() on failure
    - Maintain existing parse() interface for backward compatibility
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 5.2, 5.3_

  - [x] 6.2 Implement provider-specific request formatting
    - Create formatRequest() method with switch for each provider
    - Implement ChatGPT request format (OpenAI API structure)
    - Implement Groq request format (OpenAI-compatible structure)
    - Implement Gemini request format (Google AI structure)
    - Use consistent system prompt across all providers
    - _Requirements: 6.5, 6.4_

  - [x] 6.3 Implement provider-specific response parsing
    - Create parseResponse() method with switch for each provider
    - Parse ChatGPT response format to ExpenseData
    - Parse Groq response format to ExpenseData
    - Parse Gemini response format to ExpenseData
    - Ensure consistent ExpenseData output regardless of provider
    - _Requirements: 6.4, 6.5_

  - [x] 6.4 Implement migration logic for developer keys
    - Check if user keys exist before using developer keys
    - Fall back to developer-provided Groq key when no user keys configured
    - Add logic to switch to user keys once first key is added
    - _Requirements: 8.1, 8.2, 8.5_

  - [ ]\* 6.5 Write integration tests for expense parser
    - Test parsing with each provider
    - Test fallback logic when primary provider fails
    - Test migration from developer keys to user keys
    - Test consistent output format across providers
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 5.2, 5.3_

- [x] 7. Checkpoint - Ensure parser integration works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Build Settings UI components
  - [x] 8.1 Create KeyStatusOverview component
    - Display summary of configured providers with status indicators
    - Show count of configured vs total providers
    - Display overall feature availability status
    - _Requirements: 3.1, 4.5_

  - [x] 8.2 Create KeyCard component for individual providers
    - Display provider name, icon, and brand color
    - Show status indicator (green/red/gray dot)
    - Display masked key (last 4 characters) when configured
    - Show Add button when not configured
    - Show Test, Update, Remove buttons when configured
    - Handle loading and error states
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [x] 8.3 Create KeyInputModal component
    - Create modal with password input field for API key
    - Add Validate button that tests key before enabling Save
    - Add Save button (disabled until validation succeeds)
    - Display validation progress and results
    - Show descriptive error messages on validation failure
    - Handle timeout and network errors gracefully
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 9.1_

  - [x] 8.4 Create ScreenshotToggle component
    - Create toggle switch for screenshot monitoring
    - Set default state to disabled
    - Disable toggle (grayed out) when no valid keys exist
    - Display tooltip explaining API key requirement when disabled
    - Enable toggle when at least one valid key exists
    - Save toggle state to storage on change
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7_

  - [x] 8.5 Create PrioritySettings component
    - Display list of configured providers in priority order
    - Implement drag-and-drop reordering
    - Save priority order on change
    - Show visual feedback during drag operations
    - _Requirements: 5.4_

  - [x] 8.6 Create HelpSection component
    - Display links to get API keys for each provider
    - Show brief explanation of BYOK benefits
    - Include troubleshooting tips for common issues
    - _Requirements: 9.5, 8.3_

  - [x] 8.7 Create main AIKeySettings container component
    - Compose all sub-components into cohesive settings page
    - Implement state management for key statuses and priority
    - Load key statuses and priority on mount
    - Handle refresh after key operations
    - Implement error boundary for graceful error handling
    - _Requirements: 3.6, 10.1_

- [x] 9. Integrate Settings UI with app navigation
  - [x] 9.1 Add AI Key Settings route to app router
    - Create route path /settings/ai-keys
    - Add route to React Router configuration
    - _Requirements: 3.6_

  - [x] 9.2 Add navigation link in main settings page
    - Add "AI API Keys" menu item in settings
    - Include icon and description
    - Show badge if no keys configured
    - _Requirements: 3.6_

  - [x] 9.3 Create prompt component for missing keys
    - Display when user attempts AI feature without configured key
    - Show clear message explaining API key requirement
    - Provide direct link to AI Key Settings page
    - Include "Don't show again" option
    - _Requirements: 4.2, 4.3_

- [x] 10. Integrate with existing expense parsing features
  - [x] 10.1 Update OCR expense parsing to use KeyManager
    - Modify OCR text parsing flow to check for user keys
    - Fall back to developer keys if no user keys exist
    - Display error with key setup prompt if parsing fails
    - _Requirements: 6.1, 8.1, 8.2, 4.1, 4.2_

  - [x] 10.2 Update screenshot expense parsing to use KeyManager
    - Modify screenshot parsing flow to check for user keys
    - Disable screenshot processing if monitoring toggle is off
    - Fall back to developer keys if no user keys exist
    - Display error with key setup prompt if parsing fails
    - _Requirements: 6.2, 8.1, 8.2, 4.1, 4.2, 11.8_

  - [x] 10.3 Update notification/SMS parsing to use KeyManager
    - Modify notification text parsing flow to check for user keys
    - Fall back to developer keys if no user keys exist
    - Display error with key setup prompt if parsing fails
    - _Requirements: 6.3, 8.1, 8.2, 4.1, 4.2_

  - [x] 10.4 Update OverlayService to respect screenshot monitoring toggle
    - Check screenshot monitoring state before processing screenshots
    - Skip screenshot processing when toggle is disabled
    - Show notification explaining feature is disabled if user expects processing
    - _Requirements: 11.8_

- [x] 11. Implement error handling and user feedback
  - [x] 11.1 Add error handling for key validation failures
    - Display specific error messages for invalid keys
    - Distinguish between network errors and invalid keys
    - Show timeout messages with retry option
    - Display rate limit errors with alternative provider suggestions
    - _Requirements: 9.1, 2.5_

  - [x] 11.2 Add error handling for parsing failures
    - Log parsing errors without exposing API keys
    - Attempt fallback providers automatically
    - Display user-friendly error when all providers fail
    - Include troubleshooting steps in error message
    - _Requirements: 9.2, 9.3, 7.5_

  - [x] 11.3 Implement rate limit detection and notifications
    - Detect 429 responses from AI providers
    - Display notification suggesting alternative provider
    - Mark key as potentially rate-limited in status
    - _Requirements: 9.4, 5.5_

  - [x] 11.4 Add success feedback for key operations
    - Show toast notification on successful key addition
    - Show toast notification on successful key removal
    - Show toast notification on successful validation
    - Display success state in UI components
    - _Requirements: 1.1, 3.3_

- [x] 12. Implement cross-platform consistency
  - [x] 12.1 Test UI components on web platform
    - Verify all components render correctly
    - Test key addition, removal, and validation flows
    - Test screenshot toggle behavior
    - Test priority reordering
    - _Requirements: 10.1, 10.5_

  - [x] 12.2 Test UI components on Android platform
    - Verify all components render correctly on Android
    - Test key addition, removal, and validation flows
    - Test screenshot toggle behavior
    - Test priority reordering
    - Verify Android Keystore integration works
    - _Requirements: 10.1, 10.2, 10.5_

  - [x] 12.3 Verify parsing consistency across platforms
    - Test expense parsing produces same results on web and Android
    - Test fallback logic works identically on both platforms
    - Test error messages are consistent across platforms
    - _Requirements: 10.3, 10.4, 10.5_

- [x] 13. Final checkpoint - End-to-end testing
  - Test complete user flow: add key → enable screenshot monitoring → parse expense
  - Test fallback flow: primary provider fails → secondary provider succeeds
  - Test migration flow: no user keys → add first key → parsing switches to user key
  - Test error flow: invalid key → validation fails → user corrects key → success
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation uses JavaScript/TypeScript as specified in the design document
- Platform-specific code (Android Keystore) is isolated in separate modules
- All API keys are stored client-side only and never transmitted to backend
- The feature maintains backward compatibility with existing developer-provided keys
