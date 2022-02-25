import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :visualixir_vr, VisualixirVrWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "Xf5yEpIbmh+e/ASf7on+aWWqQGv1knq7QXmHGsPoPzu7LJlZz9jlX4JngdQIgEIx",
  server: false

# In test we don't send emails.
config :visualixir_vr, VisualixirVr.Mailer,
  adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
