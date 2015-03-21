#!janosh -f

function receive(handle, message)
   if message == 'setup' then
      print("new client")
      Janosh:wsBroadcast(JSON:encode(Janosh:get("/.")))
   else
      key, value = message:match("([^,]+),([^,]+)")
      print("set", key, value)
      Janosh:set(key, value)
   end
end

function push(key, value)
   print('push updates')
   Janosh:wsBroadcast(JSON:encode(Janosh:get("/.")))
end

Janosh:wsOpen(8082)
Janosh:wsOnReceive(receive)
Janosh:subscribe("/", push)

while true do
   Janosh:sleep(2)
end
