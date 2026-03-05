# Requirements Document

## Introduction

This document specifies requirements for the Bring Your Own Key (BYOK) feature that enables users to provide their own AI API keys (ChatGPT, Groq, or Gemini) to unlock AI-powered expense parsing features. Currently, the app uses a developer-provided Groq API key which doesn't scale for free users. This feature will allow users to bring their own keys while maintaining security and providing a seamless experience.

## Glossary

- **API_Key**: A secret authentication token provided by AI service providers (ChatGPT, Groq, or Gemini) that authorizes API requests
- **Key_Manager**: The system component responsible for storing, validating, and managing user-provided API keys
- **Expense_Parser**: The system component that uses AI services to extract expense information from OCR text, screenshots, or notification text
- **Settings_UI**: The user interface component where users manage their API keys
- **Key_Storage**: The encrypted storage mechanism for API keys
- **AI_Provider**: One of the supported AI service providers (ChatGPT, Groq, or Gemini)
- **Fallback_Logic**: The mechanism to try alternative AI providers when the primary provider fails
- **Key_Validation**: The process of testing an API key against its provider to ensure it works before saving

## Requirements

### Requirement 1: API Key Input and Storage

**User Story:** As a user, I want to input and securely save my AI API keys, so that I can use AI-powered expense parsing features without relying on developer-provided keys.

#### Acceptance Criteria

1. THE Settings_UI SHALL provide input fields for ChatGPT, Groq, and Gemini API keys
2. WHEN a user submits an API key, THE Key_Manager SHALL validate the key with the corresponding AI_Provider before saving
3. WHEN validation succeeds, THE Key_Storage SHALL encrypt and store the API key
4. THE Key_Storage SHALL store API keys using platform-specific secure storage mechanisms
5. THE Key_Manager SHALL prevent API keys from appearing in application logs or error messages

### Requirement 2: API Key Validation

**User Story:** As a user, I want the app to verify my API key works before saving it, so that I don't experience failures when trying to use AI features.

#### Acceptance Criteria

1. WHEN a user provides an API key, THE Key_Manager SHALL send a test request to the corresponding AI_Provider
2. IF the test request succeeds, THEN THE Key_Manager SHALL mark the key as valid and proceed with storage
3. IF the test request fails, THEN THE Key_Manager SHALL display a descriptive error message and prevent storage
4. THE Key_Manager SHALL complete validation within 10 seconds or display a timeout error
5. WHEN validation fails due to network issues, THE Key_Manager SHALL distinguish between network errors and invalid key errors

### Requirement 3: API Key Management Interface

**User Story:** As a user, I want to manage my API keys through a settings interface, so that I can add, update, remove, or test my keys as needed.

#### Acceptance Criteria

1. THE Settings_UI SHALL display the status of each AI_Provider key (configured, not configured, or invalid)
2. WHEN a user clicks add or update, THE Settings_UI SHALL show an input form for the selected AI_Provider
3. WHEN a user clicks remove, THE Key_Manager SHALL delete the stored key after confirmation
4. THE Settings_UI SHALL provide a test button to validate stored keys without re-entering them
5. WHEN displaying API keys, THE Settings_UI SHALL mask all characters except the last 4 characters
6. THE Settings_UI SHALL be accessible from the main settings page of the application

### Requirement 4: AI Feature Access Control

**User Story:** As a user, I want AI features to be disabled when I haven't provided an API key, so that I understand why features aren't working and what I need to do.

#### Acceptance Criteria

1. WHEN no API key is configured, THE Expense_Parser SHALL disable AI-powered parsing features
2. WHEN a user attempts to use an AI feature without a configured key, THE Settings_UI SHALL display a prompt to add an API key
3. THE Settings_UI SHALL provide a direct link from the prompt to the key management interface
4. WHEN at least one valid API key is configured, THE Expense_Parser SHALL enable AI-powered parsing features
5. THE Settings_UI SHALL display clear indicators showing which AI features are available based on configured keys

### Requirement 5: Multi-Provider Support with Fallback

**User Story:** As a user, I want the app to automatically try alternative AI providers if my primary provider fails, so that I have a reliable expense parsing experience.

#### Acceptance Criteria

1. WHEN multiple API keys are configured, THE Key_Manager SHALL maintain a priority order for AI_Provider selection
2. WHEN the primary AI_Provider fails, THE Expense_Parser SHALL attempt the request with the next available AI_Provider
3. IF all configured AI_Providers fail, THEN THE Expense_Parser SHALL return an error message indicating all providers failed
4. THE Settings_UI SHALL allow users to set the priority order of AI_Providers
5. WHEN an AI_Provider consistently fails, THE Key_Manager SHALL mark the key as potentially invalid and notify the user

### Requirement 6: Expense Parsing Integration

**User Story:** As a user, I want all AI-powered expense parsing features to use my provided API keys, so that I can parse expenses from OCR, screenshots, and notifications.

#### Acceptance Criteria

1. WHEN parsing expense data from OCR text, THE Expense_Parser SHALL use the configured API key
2. WHEN parsing expense data from screenshots, THE Expense_Parser SHALL use the configured API key
3. WHEN parsing expense data from SMS or notification text, THE Expense_Parser SHALL use the configured API key
4. THE Expense_Parser SHALL maintain the same parsing accuracy and response format regardless of which AI_Provider is used
5. WHEN switching between AI_Providers, THE Expense_Parser SHALL adapt request formats to match each provider's API specification

### Requirement 7: Security and Privacy

**User Story:** As a user, I want my API keys to be stored securely and never exposed, so that my keys cannot be stolen or misused.

#### Acceptance Criteria

1. THE Key_Storage SHALL encrypt API keys using AES-256 encryption before storage
2. THE Key_Storage SHALL use platform-specific secure storage (Android Keystore for Android, secure storage for web)
3. THE Key_Manager SHALL never transmit API keys to the application backend server
4. THE Key_Manager SHALL store API keys only on the user's device
5. WHEN the application logs errors, THE Key_Manager SHALL redact any API key values from log messages
6. THE Key_Manager SHALL clear API keys from memory immediately after use

### Requirement 8: Migration from Developer Keys

**User Story:** As an existing user, I want to seamlessly transition from developer-provided keys to my own keys, so that my experience is not disrupted.

#### Acceptance Criteria

1. WHEN a user has not configured any API keys, THE Expense_Parser SHALL continue using developer-provided keys if available
2. WHEN a user configures their first API key, THE Expense_Parser SHALL switch to using user-provided keys
3. THE Settings_UI SHALL display a notice explaining the benefits of providing personal API keys
4. WHERE developer-provided keys are rate-limited, THE Settings_UI SHALL display a message encouraging users to add their own keys
5. THE Key_Manager SHALL allow users to revert to developer-provided keys by removing all user-provided keys

### Requirement 9: Error Handling and User Feedback

**User Story:** As a user, I want clear feedback when API key operations fail, so that I can understand and resolve issues quickly.

#### Acceptance Criteria

1. WHEN API key validation fails, THE Settings_UI SHALL display the specific error reason (invalid key, network error, rate limit exceeded)
2. WHEN an AI_Provider request fails during expense parsing, THE Expense_Parser SHALL log the error and attempt fallback providers
3. IF all providers fail, THEN THE Settings_UI SHALL display a notification with troubleshooting steps
4. WHEN an API key reaches rate limits, THE Key_Manager SHALL notify the user and suggest using an alternative provider
5. THE Settings_UI SHALL provide help documentation links for obtaining API keys from each AI_Provider

### Requirement 10: Cross-Platform Consistency

**User Story:** As a user who uses both web and Android versions, I want consistent key management behavior across platforms, so that I have a unified experience.

#### Acceptance Criteria

1. THE Settings_UI SHALL provide identical key management interfaces on web and Android platforms
2. THE Key_Storage SHALL use appropriate secure storage mechanisms for each platform (Android Keystore, Web Crypto API)
3. THE Key_Manager SHALL implement the same validation logic across all platforms
4. THE Expense_Parser SHALL produce consistent parsing results regardless of platform
5. THE Settings_UI SHALL display the same error messages and user prompts across all platforms

### Requirement 11: Screenshot Monitoring Settings Control

**User Story:** As a user, I want to control whether screenshot monitoring is enabled, so that I can choose when to use AI-powered screenshot parsing and understand that it requires a valid API key.

#### Acceptance Criteria

1. THE Settings_UI SHALL provide a toggle control for enabling or disabling screenshot monitoring
2. THE Settings_UI SHALL set the screenshot monitoring toggle to disabled by default
3. WHEN no valid API key is configured, THE Settings_UI SHALL disable the screenshot monitoring toggle and display it in a grayed-out state
4. WHEN the screenshot monitoring toggle is disabled due to missing API keys, THE Settings_UI SHALL display a message explaining that a valid API key is required
5. WHEN at least one valid API key is configured, THE Settings_UI SHALL enable the screenshot monitoring toggle for user interaction
6. WHEN a user removes all configured API keys, THE Key_Manager SHALL automatically disable screenshot monitoring
7. THE Settings_UI SHALL display the screenshot monitoring toggle on the settings page alongside API key management controls
8. WHEN screenshot monitoring is disabled, THE Expense_Parser SHALL not process screenshots for expense parsing
