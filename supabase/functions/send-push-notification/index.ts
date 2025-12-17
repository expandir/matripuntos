import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: NotificationPayload = await req.json();
    const { userId, title, body, url, icon, tag } = payload;

    if (!userId || !title || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, title, body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscriptions" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscriptions found for user" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const notificationData = {
      title,
      body,
      icon: icon || "/icon-192.png",
      badge: "/icon-96.png",
      tag: tag || "default",
      data: {
        url: url || "/dashboard",
      },
      vibrate: [200, 100, 200],
    };

    const results = [];
    for (const subscription of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh_key,
            auth: subscription.auth_key,
          },
        };

        const response = await fetch(subscription.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "TTL": "86400",
          },
          body: JSON.stringify(notificationData),
        });

        if (response.status === 201 || response.status === 200) {
          await supabase
            .from("push_subscriptions")
            .update({ last_used: new Date().toISOString() })
            .eq("id", subscription.id);

          results.push({ endpoint: subscription.endpoint, success: true });
        } else if (response.status === 404 || response.status === 410) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("id", subscription.id);

          results.push({ endpoint: subscription.endpoint, success: false, removed: true });
        } else {
          results.push({ endpoint: subscription.endpoint, success: false, status: response.status });
        }
      } catch (error) {
        console.error("Error sending notification:", error);
        results.push({ endpoint: subscription.endpoint, success: false, error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({
        message: "Notifications sent",
        results,
        total: subscriptions.length,
        successful: results.filter(r => r.success).length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
