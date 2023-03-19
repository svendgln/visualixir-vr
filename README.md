# VisualixirVr

Compile: 
* mix deps.get
* mix compile
* cd assets
* npm install
* brunch build

Run:
* elixir --sname visualixir -S mix phx.server

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Visualising nodes:
* Elixir:
    * elixir --sname nodename
    * ping visualixir from new node: Node.ping(:"visualixir@nodehost")
    

* Erlang:
    * erl -sname nodename
    * ping visualixir from new node: net_adm:ping(visualixir@nodehost).




Tested on:
Elixir 1.12.3 (Erlang/OTP 22)
Elixir 1.14.3 (Erlang/OTP 25)