package com.moneymanager.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.widget.Toast;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SMSReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            SmsMessage[] messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
            if (messages == null) return;

            StringBuilder fullMessage = new StringBuilder();
            for (SmsMessage message : messages) {
                fullMessage.append(message.getMessageBody());
            }

            String messageBody = fullMessage.toString();
            
            // Regex to find currency amounts (e.g., Rs. 500, INR 500.00, etc.)
            // Matches "rs", "inr", "₹" followed by optional space and digits
            Pattern pattern = Pattern.compile("(?i)(?:rs\\.?|inr|₹)\\s*([\\d,]+(?:\\.\\d{2})?)");
            Matcher matcher = pattern.matcher(messageBody);

            if (matcher.find()) {
                String amount = matcher.group(1);
                // Show immediate popup (Toast) even if app is closed
                // This satisfies the requirement to show parsed text immediately
                Toast.makeText(context, "💰 Parsed: " + amount + "\n" + messageBody, Toast.LENGTH_LONG).show();
            } else {
                // Check for transaction keywords for debugging
                String lower = messageBody.toLowerCase();
                if (lower.contains("debited") || lower.contains("credited") || lower.contains("spent") || lower.contains("paid")) {
                     Toast.makeText(context, "📝 Transaction Detected:\n" + messageBody, Toast.LENGTH_LONG).show();
                }
            }
        }
    }
}