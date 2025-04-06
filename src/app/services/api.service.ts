import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient;
  private baseUrl: string;

  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
  }

  addMasterData(body: any): Observable<any> {
    let url_ = this.baseUrl + "/resident/create";

    const content_ = body

    let options_: any = {
      body: content_
    };

    return this.http.request<any>("post", url_, options_);
  }

  updateMasterData(id:number, body: any): Observable<any> {
    let url_ = this.baseUrl + "/resident/update/{id}";
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    const content_ = body

    let options_: any = {
      body: content_,
    };

    return this.http.request<any>("put", url_, options_);
  }

  delete(id:number): Observable<any> {
    let url_ = this.baseUrl + "/establishment/delete/{id}";
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    return this.http.request<any>("delete", url_);
  }

  getResident(options_?: {}): Observable<any[]> {
    let url_ = this.baseUrl + "/resident/";
    return this.http.request<any[]>("get", url_, options_);
  }

  getMasterData(id: number): Observable<any> {
    let url_ = this.baseUrl + "/resident/{id}";
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_: any = {
      observe: "response",
      headers: new HttpHeaders({
        "Accept": "application/json"
      })
    };

    return this.http.request<any>("get", url_, options_);
  }

  getEstablishments(options_?: {}): Observable<any[]> {
    let url_ = this.baseUrl + "/establishment";
    return this.http.request<any[]>("get", url_, options_);
  }

  storeCoordinates(body: any): Observable<any> {
    let url_ = this.baseUrl + "/establishment/coordinates";

    const content_ = body

    let options_: any = {
      body: content_
    };

    return this.http.request<any>("post", url_, options_);
  }

  getBirthDateAlert(): Observable<any[]> {
    let url_ = this.baseUrl + "/resident/birth-date-alert";
    return this.http.request<any[]>("get", url_);
  }
}
