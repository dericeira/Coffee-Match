/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
alert("Indo");
window.plugins.OneSignal
  .startInit("a7b1d9c7-a559-4147-8b4f-044439baa349", "")
  .handleNotificationOpened(function(jsonData) {
    alert("Notification opened:\n" + JSON.stringify(jsonData));
    console.log('didOpenRemoteNotificationCallBack: ' + JSON.stringify(jsonData));   
  })
  .endInit();

		window.plugins.OneSignal.getIds(function(ids) {
			localStorage.setItem("push_id",ids.pushToken);
			alert(ids.pushToken);
		});
