# Remote node code (un)loading.

defmodule VisualixirVr.Util do
  def send_module(module_name, node) do
    {module, binary, file} = :code.get_object_code(module_name)
    # call function on remote node
    # node, module(atom), function(atom), args[list]
    :rpc.call(node, :code, :load_binary, [module, file, binary])
  end

  #called locally by the node
  def cleanup do
    :code.purge(__MODULE__)
    :code.delete(__MODULE__)
  end
end
