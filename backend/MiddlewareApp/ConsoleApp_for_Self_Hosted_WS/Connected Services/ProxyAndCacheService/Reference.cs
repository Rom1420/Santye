﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Ce code a été généré par un outil.
//     Version du runtime :4.0.30319.42000
//
//     Les modifications apportées à ce fichier peuvent provoquer un comportement incorrect et seront perdues si
//     le code est régénéré.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService {
    using System.Runtime.Serialization;
    using System;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="Itinerary", Namespace="http://schemas.datacontract.org/2004/07/ConsoleApp_for_Self_Hosted_WS.Models")]
    [System.SerializableAttribute()]
    public partial class Itinerary : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.Step[] StepsField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.Step[] Steps {
            get {
                return this.StepsField;
            }
            set {
                if ((object.ReferenceEquals(this.StepsField, value) != true)) {
                    this.StepsField = value;
                    this.RaisePropertyChanged("Steps");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="Step", Namespace="http://schemas.datacontract.org/2004/07/ConsoleApp_for_Self_Hosted_WS.Models")]
    [System.SerializableAttribute()]
    public partial class Step : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private double DistanceField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string InstructionField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public double Distance {
            get {
                return this.DistanceField;
            }
            set {
                if ((this.DistanceField.Equals(value) != true)) {
                    this.DistanceField = value;
                    this.RaisePropertyChanged("Distance");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Instruction {
            get {
                return this.InstructionField;
            }
            set {
                if ((object.ReferenceEquals(this.InstructionField, value) != true)) {
                    this.InstructionField = value;
                    this.RaisePropertyChanged("Instruction");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ProxyAndCacheService.IProxyService")]
    public interface IProxyService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IProxyService/GetItinerary", ReplyAction="http://tempuri.org/IProxyService/GetItineraryResponse")]
        ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.Itinerary GetItinerary(string departure, string destination);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IProxyService/GetItinerary", ReplyAction="http://tempuri.org/IProxyService/GetItineraryResponse")]
        System.Threading.Tasks.Task<ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.Itinerary> GetItineraryAsync(string departure, string destination);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IProxyServiceChannel : ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.IProxyService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class ProxyServiceClient : System.ServiceModel.ClientBase<ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.IProxyService>, ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.IProxyService {
        
        public ProxyServiceClient() {
        }
        
        public ProxyServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public ProxyServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ProxyServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ProxyServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.Itinerary GetItinerary(string departure, string destination) {
            return base.Channel.GetItinerary(departure, destination);
        }
        
        public System.Threading.Tasks.Task<ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.Itinerary> GetItineraryAsync(string departure, string destination) {
            return base.Channel.GetItineraryAsync(departure, destination);
        }
    }
}