def updata_without_zoneline():
    messageid = 1
    payload = [
        {
            "annvalue": 0,
            "lineorder": 0,
            "linetext": "System Notification: At 0115 PST, WACM terminated request for coordinated",
            "linetype": "Author Content"
        },
        {
            "annvalue": 0,
            "lineorder": 1,
            "linetext": "operation controllable devices for Path 30 USF mitigation.",
            "linetype": "Author Content"
        }
    ]
    assert payload == payload
    assert messageid == 1
