(ns dirac.runtime.repl
  (:require [environ.core :refer [env]]))

(def ^:dynamic *agent-host* (env :dirac-agent-host))
(def ^:dynamic *agent-port* (env :dirac-agent-port))
(def ^:dynamic *agent-verbose* (env :dirac-agent-verbose))
(def ^:dynamic *agent-auto-reconnect* (env :dirac-agent-auto-reconnect))
(def ^:dynamic *agent-response-timeout* (env :dirac-agent-response-timeout))
(def ^:dynamic *weasel-verbose* (env :dirac-weasel-verbose))
(def ^:dynamic *weasel-auto-reconnect* (env :dirac-weasel-auto-reconnect))
(def ^:dynamic *weasel-pre-eval-delay* (env :dirac-weasel-pre-eval-delay))
(def ^:dynamic *install-check-total-time-limit* (env :dirac-install-check-total-time-limit))
(def ^:dynamic *install-check-next-trial-waiting-time* (env :dirac-install-check-next-trial-waiting-time))
(def ^:dynamic *install-check-eval-time-limit* (env :dirac-install-check-eval-time-limit))
(def ^:dynamic *context-availablity-total-time-limit* (env :dirac-context-availablity-total-time-limit))
(def ^:dynamic *context-availablity-next-trial-waiting-time* (env :context-availablity-next-trial-waiting-time))
(def ^:dynamic *eval-time-limit* (env :dirac-eval-time-limit))

(defmacro gen-config []
  (merge {}
         (if *agent-host* [:agent-host (str *agent-host*)])
         (if *agent-port* [:agent-port (int *agent-port*)])
         (if *agent-verbose* [:agent-verbose (boolean *agent-verbose*)])
         (if *agent-auto-reconnect* [:agent-auto-reconnect (boolean *agent-auto-reconnect*)])
         (if *agent-response-timeout* [:agent-response-timeout (int *agent-response-timeout*)])
         (if *weasel-verbose* [:weasel-verbose (boolean *weasel-verbose*)])
         (if *weasel-auto-reconnect* [:weasel-auto-reconnect (boolean *weasel-auto-reconnect*)])
         (if *weasel-pre-eval-delay* [:weasel-pre-eval-delay (int *weasel-pre-eval-delay*)])
         (if *install-check-total-time-limit* [:install-check-total-time-limit (int *install-check-total-time-limit*)])
         (if *install-check-next-trial-waiting-time* [:install-check-next-trial-waiting-time (int *install-check-next-trial-waiting-time*)])
         (if *install-check-eval-time-limit* [:install-check-eval-time-limit (int *install-check-eval-time-limit*)])
         (if *context-availablity-total-time-limit* [:context-availablity-total-time-limit (int *context-availablity-total-time-limit*)])
         (if *context-availablity-next-trial-waiting-time* [:context-availablity-next-trial-waiting-time (int *context-availablity-next-trial-waiting-time*)])
         (if *eval-time-limit* [:eval-time-limit (int *eval-time-limit*)])))

(defmacro with-safe-printing [& body]
  `(binding [cljs.core/*print-level* (dirac.runtime.prefs/pref :dirac-print-level)
             cljs.core/*print-length* (dirac.runtime.prefs/pref :dirac-print-length)]
          ~@body))